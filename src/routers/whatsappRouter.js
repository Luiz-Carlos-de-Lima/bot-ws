import { Router } from "express";
import WhatsappController from "../controllers/whatsappController";
import BaseRouter from "./baseRouter";
export default class WhatsappRouter extends BaseRouter {
  whatsappController = null;
  router = new Router();

  constructor() {
    super();
    this.whatsappController = new WhatsappController();
    this.iniciarRobo();
    this.sendMessage();
    this.replyMessage();
    this.sendMedia();
    this.sendImage();
    this.sendContacts();
    this.disconnect();
    this.getChats();
    this.getContacts();
    this.getChatById();
    this.getContactById();
    this.fetchMessages();
    this.getProfilePicUrl();
    this.archiveChat();
    this.pinChat();
    this.deleteChat();
    this.markUnread();
    this.sendSeen();
    this.pinMessage();
    this.downloadMessageMedia();
    this.reactMessage();
    this.deleteMessage();
    this.editMessage();
    this.forwardMessage();
    this.clearMessage();
    this.sendStateTyping();
    this.stopStateTyping();
  }

  iniciarRobo() {
    this.router.get("/iniciarRobo", async (_, res) => {
      let botIniciado = await this.whatsappController.iniciarBot();
      res.send(botIniciado);
    });
  }

  sendMessage() {
    this.router.post("/sendMessage", async (req, res) => {
      try {
        let body = req.body;
        console.log(body);
        if (body.phoneNumber && body.message) {
          let message = await this.whatsappController.sendMessage(
            body.phoneNumber,
            body.message
          );
          this.ok(message, res);
        } else {
          this.fail("telefone e mensagem são obrigatório", res);
        }
      } catch (e) {
        this.fail(e, res);
      }
    });
  }

  replyMessage() {
    this.router.post("/replyMessage", async (req, res) => {
      try {
        let body = req.body;

        if (!body.messageId) {
          throw new Error("messageId é obrigatório.");
        }

        if (!body.content) {
          throw new Error("content é obrigatório.");
        }

        let reply = await this.whatsappController.replyMessage(
          body.content,
          body.chatId,
          body.messageId
        );

        this.ok(reply, res);
      } catch (e) {
        this.fail(e, res);
      }
    });
  }

  sendMedia() {
    this.router.post("/sendMedia", async (req, res) => {
      try {
        let body = req.body;

        if (!body) {
          this.fail("dados da mensagem não informados.", res);
          return;
        }

        if (!body.chatId) {
          this.fail("identificação do chat é obrigatório.", res);
          return;
        }

        if (!body.base64Media) {
          this.fail("o documento em formato base64 é obrigatório.", res);
          return;
        }

        if (!body.mimeType) {
        }

        let mediaMessage = await this.whatsappController.sendMedia(
          body.chatId,
          body.base64Media,
          body.caption,
          body.mimeType
        );
        this.ok(mediaMessage, res);
      } catch (e) {
        res.send({ valido: false, message: e });
      }
    });
  }

  sendImage() {
    this.router.post("/sendImage", async (req, res) => {
      try {
        let body = req.body;

        if (!body?.phoneNumber) {
          this.fail("telefone e mensagem são obrigatório.", res);
          return;
        }

        if (!body?.base64Image) {
          this.fail("A imagem em formato base64 é obrigatório.", res);
          return;
        }

        let imageMessage = await this.whatsappController.sendImage(
          body.phoneNumber,
          body.base64Image,
          body.caption
        );
        this.ok(imageMessage, res);
      } catch (e) {
        res.send({ valido: false, message: e });
      }
    });
  }

  sendContacts() {
    this.router.post("/sendContacts", async (req, res) => {
      try {
        let body = req.body;

        if (!body?.chatId) {
          this.fail("identificação do chat é obrigatório.", res);
          return;
        }

        if (!body?.contacts) {
          this.fail("lista de contatos é obrigatório", res);
          return;
        }
        console.log(body);
        console.log("indo");
        let contactMessage = await this.whatsappController.sendContact(
          body.chatId,
          body.contacts
        );
        this.ok(contactMessage, res);
      } catch (e) {
        console.log(e);
        res.send({ valido: false, message: e });
      }
    });
  }

  disconnect() {
    this.router.post("/disconnectWhatsApp", async (_, res) => {
      try {
        await this.whatsappController.disconnect();
        this.ok({}, res);
      } catch (e) {
        res.send({ valido: false, message: e });
      }
    });
  }

  getChats() {
    this.router.get("/getChats", async (_, res) => {
      try {
        let chats = await this.whatsappController.getChats();

        this.ok(chats, res);
      } catch (e) {
        console.log(e);
        this.fail(e, res);
      }
    });
  }

  getContacts() {
    this.router.get("/getContacts", async (_, res) => {
      try {
        let contacts = await this.whatsappController.getContacts();
        this.ok(contacts, res);
      } catch (e) {
        console.log(e);
        this.fail(e, res);
      }
    });
  }

  getChatById() {
    this.router.get("/getChatById", async (req, res) => {
      try {
        let query = req.query;

        if (!query.chatId)
          throw new Error(
            "identificação do chat é obrigatório nos argumentos."
          );

        let chat = await this.whatsappController.getChatById(query.chatId);
        this.ok(chat, res);
      } catch (e) {
        console.log(e);
        this.fail(e, res);
      }
    });
  }

  getContactById() {
    this.router.get("/getContactById", async (req, res) => {
      try {
        let query = req.query;

        if (!query.contactId)
          throw new Error(
            "identificação do contato é obrigatório nos argumentos."
          );

        let contact = await this.whatsappController.getContactById(
          query.contactId
        );
        this.ok(contact, res);
      } catch (e) {
        console.log(e);
        this.fail(e, res);
      }
    });
  }

  fetchMessages() {
    this.router.get("/fetchMessages", async (req, res) => {
      try {
        let query = req.query;

        if (!query.chatId) {
          throw new Error("chatId é obrigatório nos argumentos.");
        }

        let listMessage = await this.whatsappController.fetchMessages(
          query.chatId
        );
        this.ok(listMessage, res);
      } catch (e) {
        console.log(e);
        this.fail(e, res);
      }
    });
  }

  getProfilePicUrl() {
    this.router.get("/getProfilePicUrl", async (req, res) => {
      try {
        let query = req.query;

        if (!query.chatId) {
          throw new Error("chatId é obrigatório nos argumentos.");
        }

        let image = await this.whatsappController.getProfilePicUrl(
          query.chatId
        );
        this.ok(image, res);
      } catch (e) {
        console.log(e);
        this.fail(null, res);
      }
    });
  }

  archiveChat() {
    this.router.post("/archiveChat", async (req, res) => {
      try {
        let body = req.body;

        if (!body.chatId) {
          throw new Error("chatId é obrigatório.");
        }

        let chat = await this.whatsappController.archiveChat(body.chatId);
        this.ok(chat, res);
      } catch (e) {
        console.log(e);
        this.fail(e, res);
      }
    });
  }

  pinChat() {
    this.router.post("/pinChat", async (req, res) => {
      try {
        let body = req.body;

        if (!body.chatId) {
          throw new Error("chatId é obrigatório.");
        }

        let chat = await this.whatsappController.pinChat(body.chatId);
        this.ok(chat, res);
      } catch (e) {
        console.log(e);
        this.fail(e, res);
      }
    });
  }

  downloadMessageMedia() {
    this.router.get("/downloadMessageMedia", async (req, res) => {
      try {
        let query = req.query;

        if (!query.messageId) {
          throw new Error(
            "identificação da mensagem é obrigatório nos argumentos."
          );
        }

        let messageMedia = await this.whatsappController.getMessageMedia(
          query.messageId
        );
        this.ok(messageMedia, res);
      } catch (e) {
        console.log(e);
        this.fail(e, res);
      }
    });
  }

  deleteChat() {
    this.router.post("/deleteChat", async (req, res) => {
      try {
        let body = req.body;

        if (!body.chatId) {
          throw new Error("chatId é obrigatório.");
        }

        let chat = await this.whatsappController.deleteChat(body.chatId);
        this.ok(chat, res);
      } catch (e) {
        console.log(e);
        this.fail(e, res);
      }
    });
  }

  markUnread() {
    this.router.post("/markUnread", async (req, res) => {
      try {
        let body = req.body;

        if (!body.chatId) {
          throw new Error("chatId é obrigatório.");
        }

        let chat = await this.whatsappController.markUnread(body.chatId);
        this.ok(chat, res);
      } catch (e) {
        console.log(e);
        this.fail(e, res);
      }
    });
  }

  sendSeen() {
    this.router.post("/sendSeen", async (req, res) => {
      try {
        let body = req.body;

        if (!body.chatId) {
          throw new Error("chatId é obrigatório.");
        }

        let chat = await this.whatsappController.sendSeen(body.chatId);
        this.ok(chat, res);
      } catch (e) {
        console.log(e);
        this.fail(e, res);
      }
    });
  }

  pinMessage() {
    this.router.post("/pinMessage", async (req, res) => {
      try {
        let body = req.body;

        if (!body.messageId) {
          throw new Error("messageId é obrigatório.");
        }

        let pinned = await this.whatsappController.pinMessage(
          body.messageId,
          body.duration
        );
        this.ok(pinned, res);
      } catch (e) {
        console.log(e);
        this.fail(e, res);
      }
    });
  }

  reactMessage() {
    this.router.post("/reactMessage", async (req, res) => {
      try {
        let body = req.body;

        if (!body.messageId) {
          throw new Error("messageId é obrigatório.");
        }

        if (!body.reaction) {
          throw new Error("reaction é obrigatório.");
        }

        let reacted = await this.whatsappController.reactMessage(
          body.messageId,
          body.reaction
        );
        this.ok(reacted, res);
      } catch (e) {
        console.log(e);
        this.fail(e, res);
      }
    });
  }

  deleteMessage() {
    this.router.post("/deleteMessage", async (req, res) => {
      try {
        let body = req.body;
        let everyone = false;

        if (!body.messageId) {
          throw new Error("messageId é obrigatório.");
        }

        if (!body.everyone) {
          everyone = false;
        } else {
          everyone = body.everyone;
        }

        let deleted = await this.whatsappController.deleteMessage(
          body.messageId,
          everyone
        );
        this.ok(deleted, res);
      } catch (e) {
        console.log(e);
        this.fail(e, res);
      }
    });
  }

  editMessage() {
    this.router.post("/editMessage", async (req, res) => {
      try {
        let body = req.body;

        if (!body.messageId) {
          throw new Error("messageId é obrigatório.");
        }

        if (!body.content) {
          throw new Error("content é obrigatório.");
        }

        let edited = await this.whatsappController.editMessage(
          body.messageId,
          body.content
        );
        this.ok(edited, res);
      } catch (e) {
        console.log(e);
        this.fail(e, res);
      }
    });
  }

  forwardMessage() {
    this.router.post("/forwardMessage", async (req, res) => {
      try {
        let body = req.body;

        if (!body.messageId) {
          throw new Error("messageId é obrigatório.");
        }

        if (!body.chatIdForward) {
          throw new Error("chatIdForward é obrigatório.");
        }

        let forwarded = await this.whatsappController.forwardMessage(
          body.messageId,
          body.chatIdForward
        );
        this.ok(forwarded, res);
      } catch (e) {
        console.log(e);
        this.fail(e, res);
      }
    });
  }

  clearMessage() {
    this.router.post("/clearMessage", async (req, res) => {
      try {
        let body = req.body;

        if (!body.chatId) {
          throw new Error("chatId é obrigatório.");
        }

        let chat = await this.whatsappController.clearMessage(body.chatId);
        this.ok(chat, res);
      } catch (e) {
        console.log(e);
        this.fail(e, res);
      }
    });
  }

  sendStateTyping() {
    this.router.post("/sendStateTyping", async (req, res) => {
      try {
        let body = req.body;

        if (!body.chatId) {
          throw new Error("chatId é obrigatório.");
        }

        let sendStateTyping = await this.whatsappController.sendStateTyping(
          body.chatId
        );
        this.ok(sendStateTyping, res);
      } catch (e) {
        console.log(e);
        this.fail(e, res);
      }
    });
  }

  stopStateTyping() {
    this.router.post("/stopStateTyping", async (req, res) => {
      try {
        let body = req.body;

        if (!body.chatId) {
          throw new Error("chatId é obrigatório.");
        }

        let stopStateTyping = await this.whatsappController.stopStateTyping(
          body.chatId
        );
        this.ok(stopStateTyping, res);
      } catch (e) {
        console.log(e);
        this.fail(e, res);
      }
    });
  }
}
