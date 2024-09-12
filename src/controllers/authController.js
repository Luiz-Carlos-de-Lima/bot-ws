import moment from "moment";

import Otp from "../models/otpModel";
import whatsappWebJS from "../services/whatsapp_web";
import Utils from "../utils/utils";

export default class AuthController {

  async sendOtpWhatsapp(phoneNumber, headers) {
    if (whatsappWebJS.autenticated) {
      let code = Utils.tokenRandom(6);

      const validade = moment().add(5, "minutes").toDate();

      const novaOtp = new Otp({
        code: code,
        phone: phoneNumber,
        validade: validade,
        headers: headers,
        used: false,
      });

      await novaOtp.save();

      let message = `Seu código de autenticação é ${code}`;

      await whatsappWebJS.sendMessage(phoneNumber, message);
    } else {
      throw new Error('Robo de autenticação parado');
    }
  }

  async validateOtpCode(code, phoneNumber) {
    const otp = await Otp.findOne({
      code: code,
      phone: phoneNumber,
      used: false,
      validade: { $gte: new Date() },
    });

    if (otp) {
      otp.used = true;
      await otp.save();
    } else {
      throw new Error('O código informado é inválido');
    }
  }
}
