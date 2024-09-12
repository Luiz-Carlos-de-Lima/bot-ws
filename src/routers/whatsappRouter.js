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
    this.deleteRouter();
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
          res.send({ valido: true });
        } else {
          res.send({
            valido: false,
            message: "telefone e mensagem são obrigatório",
          });
        }
      } catch (e) {
        res.send({ valido: false, message: e });
      }
    });
  }

  deleteRouter() {
    this.router.post("/deleteFolder", async (req, res) => {
      await this.whatsappController.deleteFolderTeste();
      this.ok({}, res);
    });
  }
}
