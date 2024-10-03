import { Client, MessageMedia } from "whatsapp-web.js";

import WhatsappWebBase from "./whatsappBase";
import AlphaxLocalAuth from "../../authStrategies/alphaxLocalAuth";

class WhatsappWebJS extends WhatsappWebBase {
  qrCode = "";
  autenticated = false;
  _callback;

  _client = null;

  constructor() {
    super();
    this._init();
  }

  _init() {
    this._client = null;
    this._client = new Client({
      authStrategy: new AlphaxLocalAuth(),
      puppeteer: {
        headless: true,
        args: [
          "--no-sandbox",
          "--no-experiments",
          "--hide-scrollbars",
          "--disable-plugins",
          "--disable-infobars",
          "--disable-translate",
          "--disable-pepper-3d",
          "--disable-extensions",
          "--disable-dev-shm-usage",
          "--disable-notifications",
          "--disable-setuid-sandbox",
          "--disable-crash-reporter",
          "--disable-smooth-scrolling",
          "--disable-login-animations",
          "--disable-dinosaur-easter-egg",
          "--disable-accelerated-2d-canvas",
          "--disable-rtc-smoothness-algorithm",
        ],
      },
    });
    this.qrCode = "";
    this.autenticated = false;
    this._generateQrCode();
    this._client
      .initialize()
      .then((e) => console.log("Robo Iniciado"))
      .catch((e) => {
        console.log("Erro ao iniciar o robo");
        console.log(e);
        this._init();
      });
  }

  setCallbackControlMessage(callback) {
    this._callback = callback;
  }

  _generateQrCode() {
    this._client.on("qr", (qr) => {
      console.log("Generate qr code");
      this.qrCode = qr;
    });
    this._client.on("authenticated", () => {
      console.log("authenticated");
      this.autenticated = true;
    });
    this._client.on("ready", () => {
      console.log("ready");
      this.autenticated = true;
    });
    this._client.on("auth_failure", async () => {
      console.log("auth_failure");
      // await this._deleteFolders();
      this.autenticated = false;
    });
    this._client.on("disconnected", async (_) => {
      console.log("disconnected");
      await this._disableValuesWhatsapp();
    });

    this._client.on("message", async (msg) => {
      if (typeof this._callback === "function") {
        let responseMessage = await this._callback(msg.body);
        if (responseMessage) {
          this._client.sendMessage(msg.from, responseMessage);
        }
      }
    });
  }

  async _disableValuesWhatsapp() {
    await this._client.destroy();
    this._init();
    this.autenticated = false;
  }

  async sendMessage(phoneNumber, message) {
    try {
      if (this.autenticated) {
        let chatId = await this._getChatId(phoneNumber);
        if (chatId) {
          await this._client.sendMessage(chatId, message);
        }
      } else {
        throw new Error(
          "Obrigatório estar autenticado para o envio de mensagem"
        );
      }
    } catch (e) {
      throw new Error(e.toString());
    }
  }

  async _getChatId(phoneNumber) {
    try {
      let phoneId = await this._client.getNumberId(phoneNumber);
      return phoneId ? phoneId._serialized : null;
    } catch (e) {
      return null;
    }
  }

  async sendImage(phoneNumber, base64Image, caption) {
    try {
      if (this.autenticated) {
        let chatId = await this._getChatId(phoneNumber);
        if (chatId) {
          const media = new MessageMedia("image/png", base64Image);
          await this._client.sendMessage(chatId, media, { caption: caption });
        }
      } else {
        throw new Error(
          "Obrigatório estar autenticado para o envio de mensagem"
        );
      }
    } catch (e) {
      throw new Error(e.toString());
    }
  }

  async disconnect() {
    await this._client.logout();
    await this._disableValuesWhatsapp();
  }
}

export default new WhatsappWebJS();
