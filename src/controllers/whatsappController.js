import whatsappWebJS from "../services/whatsapp_web";
import Utils from "../utils/utils";

export default class WhatsappController {
  botIniciado = false;

  async iniciarBot() {
    if (whatsappWebJS.autenticated) {
      return {
        sessaoIniciada: true,
        qrCode: "",
      };
    } else {
      if (!whatsappWebJS.qrCode) {
        console.log("Antes do delay");
        await Utils.delay(2000);
        console.log("Depois do delay");
        return this.iniciarBot();
      }
      return {
        sessaoIniciada: false,
        qrCode: whatsappWebJS.qrCode,
      };
    }
  }

  async sendMessage(phoneNumber, message) {
    if (whatsappWebJS.autenticated) {
      whatsappWebJS.sendMessage(phoneNumber, message);
    }
  }
}
