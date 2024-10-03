import whatsappWebJS from "../services/whatsapp/whatsapp_web";

import AltomaticMessageController from "./altomaticMessageController";

export default class WhatsappController {
  botIniciado = false;
  altomaticMessageController = new AltomaticMessageController();

  constructor() {
    whatsappWebJS.setCallbackControlMessage(
      this.altomaticMessageController.controlMessage
    );
  }

  async iniciarBot() {
    let contador = 0;
    return new Promise((resolve, reject) => {
      let interval = setInterval(() => {
        if (contador > 10) {
          clearInterval(interval);
          reject({
            sessaoIniciada: true,
            message: "Foi excedido o máximo de tentativas, tente novamente.",
            qrCode: "",
          });
        }

        if (whatsappWebJS.autenticated) {
          clearInterval(interval);
          resolve({
            sessaoIniciada: true,
            qrCode: "",
          });
        } else if (whatsappWebJS.qrCode) {
          clearInterval(interval);
          resolve({
            sessaoIniciada: false,
            qrCode: whatsappWebJS.qrCode,
          });
        }

        contador++;
      }, 2000);
    });
  }

  async sendMessage(phoneNumber, message) {
    if (whatsappWebJS.autenticated) {
      await whatsappWebJS.sendMessage(phoneNumber, message);
    }
  }

  async sendImage(phoneNumber, base64Image, caption) {
    if (whatsappWebJS.autenticated) {
      await whatsappWebJS.sendImage(phoneNumber, base64Image, caption);
    }
  }

  async disconnect() {
    if (whatsappWebJS.autenticated) {
      await whatsappWebJS.disconnect();
    }
  }
}
