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
    this.sendImage();
    this.disconnect();
    this.getChats();
    this.fetchMessages();
    this.getProfilePicUrl();
    this.archiveChat();
    this.pinChat();
    this.deleteChat();
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
          this.whatsappController.sendMessage(body.phoneNumber, body.message);
          this.ok({}, res);
        } else {
          this.fail("telefone e mensagem são obrigatório", res);
        }
      } catch (e) {
        this.fail(e, res);
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

        await this.whatsappController.sendImage(
          body.phoneNumber,
          body.base64Image,
          body.caption
        );
        this.ok({}, res);
      } catch (e) {
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
}
