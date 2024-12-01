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

    whatsappWebJS.onMessageAck(async (message) => {
      socket.io.emit("messageAck", message);
    });

    whatsappWebJS.onChatArchived(async (chat) => {
      socket.io.emit("chatArchived", chat);
    });

    whatsappWebJS.onUnreadCount(async (chat) => {
      socket.io.emit("unreadCount", chat);
    });
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

  async replyMessage(content, chatId, messageId) {
    if (whatsappWebJS.autenticated) {
      return await whatsappWebJS.replyMessage(content, chatId, messageId);
    }

    return null;
  }

  async sendMessage(phoneNumber, message) {
    if (whatsappWebJS.autenticated) {
      return await whatsappWebJS.sendMessage(phoneNumber, message);
    }

    return null;
  }

  async sendImage(phoneNumber, base64Image, caption) {
    if (whatsappWebJS.autenticated) {
      return await whatsappWebJS.sendImage(phoneNumber, base64Image, caption);
    }
  }

  async sendMedia(chatId, base64Media, caption, mimeType) {
    if (whatsappWebJS.autenticated) {
      return await whatsappWebJS.sendMedia(
        chatId,
        base64Media,
        caption,
        mimeType
      );
    }
  }

  async sendContact(chatId, contacts) {
    if (whatsappWebJS.autenticated) {
      return await whatsappWebJS.sendContact(chatId, contacts);
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

  async getContacts() {
    if (whatsappWebJS.autenticated) {
      let listContacts = await whatsappWebJS.getContacts();
      return listContacts;
    }
  }

  async getChatById(chatId) {
    if (whatsappWebJS.autenticated) {
      let chat = await whatsappWebJS.getChatById(chatId);
      return chat;
    }
  }

  async getContactById(contactId) {
    if (whatsappWebJS.autenticated) {
      let contact = await whatsappWebJS.getContactById(contactId);
      return contact;
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
      return await whatsappWebJS.archiveChat(chatId);
    }

    return false;
  }

  async pinChat(chatId) {
    if (whatsappWebJS.autenticated) {
      return await whatsappWebJS.pinnedChat(chatId);
    }

    return false;
  }

  async deleteChat(chatId) {
    if (whatsappWebJS.autenticated) {
      return await whatsappWebJS.deleteChat(chatId);
    }

    return false;
  }

  async markUnread(chatId) {
    if (whatsappWebJS.autenticated) {
      return await whatsappWebJS.markUnread(chatId);
    }

    return false;
  }

  async sendSeen(chatId) {
    if (whatsappWebJS.autenticated) {
      return await whatsappWebJS.sendSeen(chatId);
    }

    return false;
  }

  async pinMessage(messageId, duration) {
    if (whatsappWebJS.autenticated) {
      return await whatsappWebJS.pinMessage(messageId, duration);
    }

    return false;
  }

  async getMessageMedia(messageId) {
    if (whatsappWebJS.autenticated) {
      return await whatsappWebJS.getMessageMedia(messageId);
    }

    return null;
  }

  async reactMessage(messageId, reaction) {
    if (whatsappWebJS.autenticated) {
      return await whatsappWebJS.reactMessage(messageId, reaction);
    }

    return false;
  }

  async deleteMessage(messageId, everyone) {
    if (whatsappWebJS.autenticated) {
      return await whatsappWebJS.deleteMessage(messageId, everyone);
    }

    return false;
  }

  async editMessage(messageId, content) {
    if (whatsappWebJS.autenticated) {
      return await whatsappWebJS.editMessage(messageId, content);
    }

    return null;
  }

  async forwardMessage(messageId, chatIdForward) {
    if (whatsappWebJS.autenticated) {
      return await whatsappWebJS.forwardMessage(messageId, chatIdForward);
    }

    return false;
  }

  async clearMessage(chatId) {
    if (whatsappWebJS.autenticated) {
      return await whatsappWebJS.clearMessage(chatId);
    }

    return false;
  }

  async sendStateTyping(chatId) {
    if (whatsappWebJS.autenticated) {
      return await whatsappWebJS.sendStateTyping(chatId);
    }

    return false;
  }

  async stopStateTyping(chatId) {
    if (whatsappWebJS.autenticated) {
      return await whatsappWebJS.stopStateTyping(chatId);
    }

    return false;
  }
}
