import WhatsappWebJS from "../services/whatsapp_web";
import Utils from "../utils/utils";

export default class WhatsappController {
  whatsappWebJS = null;
  botIniciado = false;

  constructor () {
    this.whatsappWebJS = new WhatsappWebJS();
  }

  async iniciarBot() {
    if (this.whatsappWebJS.autenticated) {
        return {
          sessaoIniciada: true,
          qrCode: '',
        };
      } else {
        console.log(this.whatsappWebJS.qrCode);
        if (!this.whatsappWebJS.qrCode) {
          console.log('Antes do delay');
          await Utils.delay(2000);
          console.log('Depois do delay');
          return this.iniciarBot();
        }
        return {
          sessaoIniciada: false,
          qrCode: this.whatsappWebJS.qrCode,
        };
      }
  }

  async sendMessage(phoneNumber, message) {
    this.whatsappWebJS.sendMessage(phoneNumber, message);
  }
}
