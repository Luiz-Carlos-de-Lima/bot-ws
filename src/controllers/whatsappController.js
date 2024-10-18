import whatsappWebJS from "../services/whatsapp/whatsapp_web";
import AltomaticMessageController from "./altomaticMessageController";
import socket from "../services/socketIO/socket";

export default class WhatsappController {
  botIniciado = false;
  altomaticMessageController = new AltomaticMessageController();

  constructor() {
    whatsappWebJS.onMessage(async (message) => {
      this.altomaticMessageController.controlMessage(message.body);
      let listChat = await this.getChats();
      socket.io.emit("listChats", listChat);
      socket.io.emit("message", message);
    });

    whatsappWebJS.onQrCode((qrCode) => {
      socket.io.emit("qrCode", qrCode);
    });

    whatsappWebJS.onAuthenticated(() => {
      socket.io.emit("authenticated");
    });

    whatsappWebJS.onDisconnected(() => {
      socket.io.emit("logout");
    });

    whatsappWebJS.onReady(() => {
      socket.io.emit("ready");
      console.log("Ouvindo chatArchived");
      socket.io.on("chatArchived", async (chatId) => {
        console.log("Aquivando chat");
        await this.archiveChat(chatId);
      });
    });

    whatsappWebJS.onMessageAck(async (_) => {
      let listChat = await this.getChats();
      socket.io.emit("listChats", listChat);
    });

    whatsappWebJS.onChatArchived(async (_) => {
      let listChat = await this.getChats();
      socket.io.emit("listChats", listChat);
    });

    // socket.io.on("chatArchived", async (chatId) => {
    //   await this.archiveChat(chatId);
    // });
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

  async getChats() {
    if (whatsappWebJS.autenticated) {
      let listChats = await whatsappWebJS.getChats();
      return listChats;
    }
  }

  async getProfilePicUrl(chatId) {
    let image = await whatsappWebJS.getProfilePicUrl(chatId);
    return image;
  }

  async fetchMessages(chatId) {
    if (whatsappWebJS.autenticated) {
      let listMessage = await whatsappWebJS.fetchMessages(chatId);

      return listMessage;
    }
  }

  async archiveChat(chatId) {
    if (whatsappWebJS.autenticated) {
      await whatsappWebJS.archiveChat(chatId);
    }
  }

  async pinChat(chatId) {
    if (whatsappWebJS.autenticated) {
      await whatsappWebJS.pinnedChat(chatId);
    }
  }

  async deleteChat(chatId) {
    if (whatsappWebJS.autenticated) {
      await whatsappWebJS.deleteChat(chatId);
    }
  }
}
