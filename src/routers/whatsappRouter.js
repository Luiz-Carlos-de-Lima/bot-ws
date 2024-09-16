import { Router } from "express";
import WhatsappController from "../controllers/whatsappController";
import BaseRouter from "./baseRouter";
export default class WhatsappRouter extends BaseRouter  {
  whatsappController = null;
  router = new Router();

  constructor() {
    super();
    this.whatsappController = new WhatsappController();
    this.iniciarRobo();
    this.sendMessage();
    this.sendImage();
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
          this.ok({},res);
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
        this.fail( "A imagem em formato base64 é obrigatório.", res);
        return;
      }

      await this.whatsappController.sendImage(body.phoneNumber, body.base64Image, body.caption);
      this.ok({},res);
    } catch (e) {
        res.send({ valido: false, message: e });
      }
    });
  }
}
