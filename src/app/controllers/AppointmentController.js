import Appointment from "../models/Apointment";
import Notification from "../schemas/Notification";
import * as Yup from "yup";
import { startOfHour, parseISO, isBefore, format } from "date-fns";
import pt from "date-fns/locale/pt";
import User from "../models/User";
import File from "../models/File";
import { Op } from "sequelize";
import Queue from "../../lib/Queue";
import CancellationMail from "../jobs/CancellationMail";

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const userId = req.userId;
    const appointments = await Appointment.findAll({
      where: { user_id: userId, canceled_at: null },
      attributes: ["id", "date", "canceled_at"],
      order: ["date"],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: "provider",
          attributes: ["id", "name"],
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
    return res.json(appointments);
  }
  async store(req, res) {
    const Schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required()
    });
    if (!(await Schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    const user_id = req.userId;
    const { provider_id, date } = req.body;

    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true }
    });

    if (!isProvider) {
      return res.status(401).json({ error: "Provider is not valid!" });
    }

    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: "Past date is not permitted" });
    }

    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart
      }
    });


    if (checkAvailability) {
      return res
        .status(400)
        .json({ error: "Appointment date is not available" });
    }

    const apointment = await Appointment.create({
      user_id,
      date: hourStart,
      provider_id
    });

    const { name } = await User.findByPk(req.userId);
    const formattedDate = format(hourStart, "dd 'de' MMMM,' às 'H:mm'h'", {
      locale: pt
    });
    await Notification.create({
      content: `Novo agendamento de ${name} para o dia ${formattedDate}`,
      user: provider_id
    });

    return res.json(apointment);
  }

  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "provider",
          attributes: ["name", "email"]
        },
        {
          model: User,
          as: "user",
          attributes: ["name"]
        }
      ]
    });

    if (!appointment) {
      return res.status(401).json({ error: "Appointment id does not exist." });
    }

    if (appointment.user_id != req.userId) {
      return res
        .status(401)
        .json({ error: "This users does not have this appointment" });
    }

    const alreadyCanceled = await Appointment.findOne({
      where: {
        id: req.params.id,
        canceled_at: {
          [Op.not]: null
        }
      }
    });

    if (alreadyCanceled) {
      return res.status(401).json({ error: "Appointment already canceled" });
    }

    appointment.canceled_at = new Date();
    await appointment.save();

    await Queue.add(CancellationMail.key, {
      appointment
    });

    return res.json(appointment);
  }
}
export default new AppointmentController();
