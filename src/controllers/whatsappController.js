import whatsappWebJS from "../services/whatsapp_web";
import Utils from "../utils/utils";

export default class WhatsappController {
  botIniciado = false;

  // async iniciarBot() {
  //   if (whatsappWebJS.autenticated) {
  //     return {
  //       sessaoIniciada: true,
  //       qrCode: "",
  //     };
  //   } else {
  //     if (!whatsappWebJS.qrCode) {
  //       console.log("Antes do delay");
  //       await Utils.delay(2000);
  //       console.log("Depois do delay");
  //       return this.iniciarBot();
  //     }
  //     return {
  //       sessaoIniciada: false,
  //       qrCode: whatsappWebJS.qrCode,
  //     };
  //   }
  // }

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
      whatsappWebJS.sendMessage(phoneNumber, message);
    }
  }

  async deleteFolderTeste() {
    await whatsappWebJS._deleteFolders();
  }
}
