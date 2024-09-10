import { Router } from "express";
import Utils from "../utils/utils";
import AuthController from "../controllers/authController";
import BaseRouter from "./baseRouter";

export default class AuthRouter extends BaseRouter {
  authController = null;
  router = new Router();

  constructor() {
    super();
    this.authController = new AuthController();
    this.sendOtpWhatsapp();
    this.validateOtpCode();
  }

  sendOtpWhatsapp() {
    this.router.post("/sendOtpWhatsapp", async (req, res) => {
      try {
        let body = req.body;
        if (body.phoneNumber) {
          await this.authController.sendOtpWhatsapp(body.phoneNumber);
          this.ok({}, res);
        } else {
          this.fail("O número de telefone é obrigatório", res);
        }
      } catch (e) {
        this.fail(Utils.trataMensagemErrorTry(e), res);
      }
    });
  }

  validateOtpCode() {
    this.router.post("/validateOtpCode", async (req, res) => {
      try {
        let body = req.body;

        if (body.code) {
          await this.authController.validateOtpCode(body.code);
          this.ok({}, res);
        } else {
          this.fail("O código para verificação é obrigatório.", res);
        }
      } catch (e) {
        this.fail(Utils.trataMensagemErrorTry(e), res);
      }
    });
  }
}
