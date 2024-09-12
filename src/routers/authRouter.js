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
        let headers = req.headers;
        if (body.phoneNumber) {
          await this.authController.sendOtpWhatsapp(body.phoneNumber, headers);
          this.ok({}, res);
        } else {
          this.fail("O campo phoneNumber é obrigatório", res);
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

        if (!body.code) {
          this.fail("O campo código code é obrigatório.", res);
          return;
        }

        if (!body.phoneNumber) {
          this.fail("O campo phoneNumber é obrigatório", res);
          return;
        }

        await this.authController.validateOtpCode(body.code, body.phoneNumber);
        this.ok({}, res);
      } catch (e) {
        this.fail(Utils.trataMensagemErrorTry(e), res);
      }
    });
  }
}
