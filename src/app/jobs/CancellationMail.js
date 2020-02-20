import { format } from "date-fns";
import pt from "date-fns/locale/pt";
import Mail from "../../lib/Mail";

class CancellationMail {
  get key() {
    return "CancellationMail";
  }

  async handle({ data }) {
    const { appointment } = data;
    Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: "Angendamento cancelado",
      template: "cancelation",
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: appointment.date
      }
    });
  }
}

export default new CancellationMail();
