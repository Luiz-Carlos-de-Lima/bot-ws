import { Router } from "express";
import WhatsappController from "../controllers/whatsappController";

export default class WhatsappRouter {
  whatsappController = null;
  router = Router();

  constructor() {
    this.whatsappController = new WhatsappController();
    this.iniciarRobo();
    this.sendMessage();
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
}
