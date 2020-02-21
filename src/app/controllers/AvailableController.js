import { startOfDay, endOfDay } from "date-fns";
import Appointment from "../models/Apointment";
import { Op } from "sequelize";

class AvailableController {
  async index(req, res) {
    const { date } = req.query;
    const providerId = req.params.id;

    if (!date) {
      return res.status(400).json({ error: "Please enter the date" });
    }

    const searchDate = Number(date);

    const appointments = await Appointment.findAll({
      where: {
        provider_id: providerId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)]
        }
      }
    });
    return res.json({ appointments });
  }
}
export default new AvailableController();
