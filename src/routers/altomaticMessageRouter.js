import { Router } from "express";

import BaseRouter from "./baseRouter";
import AltomaticMessageController from "../controllers/altomaticMessageController";

export default class AltomaticMessageRouter extends BaseRouter {
  router = new Router();
  altomaticMessageController = new AltomaticMessageController();

  constructor() {
    super();
    this.getMessage();
    this.createMessage();
    this.deleteMessage();
    this.updateMessage();
  }

  getMessage() {
    this.router.get("/getAltomaticMessage", async (req, res) => {
      try {
        let data;
        if (req.query.id) {
          data = await this.altomaticMessageController.fetchMessages(
            req.query.id
          );
        } else {
          data = await this.altomaticMessageController.getMessage();
        }

        this.ok(data, res);
      } catch (e) {
        console.log(e);
        this.fail(e, res);
      }
    });
  }

  createMessage(data) {
    this.router.post("/createAltomaticMessage", async (req, res) => {
      try {
        const body = req.body;

        if (!body.description) {
          throw new Error("Campo 'description' é obrigatório.");
        }
        if (!body.sendMessage) {
          throw new Error("Campo 'sendMessage é obrigatório.");
        }

        if (!body.responseMessage) {
          throw new Error("Campo 'responseMessage'é obrigatório.");
        }
        if (!body.enable) {
          throw new Error("Campo 'enable'é obrigatório");
        }

        body.pattern = false;
        body.modified = false;

        await this.altomaticMessageController.createMessage(body);
        this.ok({}, res);
      } catch (e) {
        this.fail(e, res);
      }
    });
  }

  deleteMessage() {
    this.router.delete("/deleteAltomaticMessage", async (req, res) => {
      try {
        if (!req.query.id) {
          throw new Error("argumento 'id' é obrigatório.");
        }

        await this.altomaticMessageController.deleteMessage(req.query.id);
        this.ok({}, res);
      } catch (e) {
        this.fail("Ocorreu um erro " + e, res);
      }
    });
  }

  updateMessage() {
    this.router.post("/updateAltomaticMessage", async (req, res) => {
      try {
        const body = req.body;
        if (!body._id) {
          throw new Error("argumento 'id' é obrigatório.");
        }
        if (!body.description) {
          throw new Error("Campo 'description' é obrigatório.");
        }
        if (!body.sendMessage) {
          throw new Error("Campo 'sendMessage é obrigatório.");
        }
        if (!body.responseMessage) {
          throw new Error("Campo 'responseMessage'é obrigatório.");
        }

        body.pattern = body.pattern ?? false;
        body.modified = body.modified ?? true;

        const message = await this.altomaticMessageController.updateMessage(
          body._id,
          body
        );
        this.ok(message, res);
      } catch (e) {
        console.log(e);
        this.fail("Ocorreu um erro" + e, res);
      }
    });
  }
}
