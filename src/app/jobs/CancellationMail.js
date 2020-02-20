import { format } from "date-fns";
import pt from "date-fns/locale/pt";
import Mail from "../../lib/Mail";
import { parseISO, format } from "date-fns";

class CancellationMail {
  get key() {
    return "CancellationMail";
  }

  async handle({ data }) {
    const { appointment } = data;
    console.log("!!!!!!!!!!!!!!!!!Success!!!!!!!!!!!!!!!!!!!!!!!!");
    Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: "Angendamento cancelado",
      template: "cancelation",
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(
          parseISO(appointment.date),
          "'Dia' dd 'de' MMMM' de 'yyyy', às 'H:mm'h'",
          {
            locale: pt
          }
        )
      }
    });
  }
}

export default new CancellationMail();
