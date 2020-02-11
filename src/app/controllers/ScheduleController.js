import User from "../models/User";
import File from "../models/File";
import Appointment from "../models/Apointment";
import { startOfDay, endOfDay, parseISO } from "date-fns";
import { Op } from "sequelize";
class ScheduleController {
  async index(req, res) {
    const { date } = req.query;
    const parsedDate = parseISO(date);
    const isProvider = await User.findOne({
      where: {
        id: req.userId,
        provider: true
      }
    });

    if (!isProvider) {
      return res.status(401).json({ error: "User is not a provider" });
    }
    const schedule = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)]
        }
      },
      attributes: ["id", "date"],
      order: ["date"],
      include: [
        {
          model: User,
          attributes: ["name", "email"],
          as: "user",
          include: [
            {
              model: File,
              as: "avatar",
              attributes: ["url", "path", "name"]
            }
          ]
        }
      ]
    });
    return res.json(schedule);
  }
}

export default new ScheduleController();
