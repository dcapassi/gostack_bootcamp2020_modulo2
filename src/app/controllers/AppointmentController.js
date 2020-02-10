import Appointment from "../models/Apointment";
import * as Yup from "yup";
import User from "../models/User";

class AppointmentController {
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

    const apointment = await Appointment.create({
      user_id,
      date,
      provider_id
    });

    return res.json(apointment);
  }
}
export default new AppointmentController();
