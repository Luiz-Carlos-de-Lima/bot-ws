import whatsappWebJS from "../services/whatsapp/whatsapp_web";
import nlp from "compromise";

import utils from "../utils/utils";

export default class WhatsappController {
  botIniciado = false;

  constructor() {
    whatsappWebJS.setCallbackControlMessage(this._controlMessage);
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

  async _controlMessage(message) {
    const doc = nlp(String(message).toLowerCase());

    await utils.delay(2000);

    if (
      doc.has("cardápio") ||
      doc.has("cardapio") ||
      doc.has("menu") ||
      doc.has("pedido")
    ) {
      return "Aqui está o nosso cardápio: https://jclan-app.alphax.jclan.com.br/";
    }
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
}
