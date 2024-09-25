import { Client, MessageMedia } from "whatsapp-web.js";

import WhatsappWebBase from "./whatsappBase";
import AlphaxLocalAuth from "../../authStrategies/alphaxLocalAuth";

class WhatsappWebJS extends WhatsappWebBase {
  qrCode = "";
  autenticated = false;

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
      await this._client.destroy();
      this._init();
      this.autenticated = false;
    });

    this._client.on("message", async (msg) => {
      console.log("MESSAGE RECEIVED", msg);

      if (msg.body === "!ping reply") {
        // Send a new message as a reply to the current one
        msg.reply("pong");
      } else if (msg.body === "!ping") {
        // Send a new message to the same chat
        this._client.sendMessage(msg.from, "pong");
      }
    });
  }

  async sendMessage(phoneNumber, message) {
    try {
      if (this.autenticated) {
        let chatId = this._getChatId(phoneNumber);
        await this._client.sendMessage(chatId, message);
      } else {
        throw new Error(
          "Obrigatório estar autenticado para o envio de mensagem"
        );
      }
    } catch (e) {
      throw new Error(e.toString());
    }
  }

  _getChatId(phoneNumber) {
    let cleanPhoneNumber = phoneNumber.replace(/[()\-\s]/g, "");
    if (cleanPhoneNumber.length == 11) {
      cleanPhoneNumber =
        cleanPhoneNumber.slice(0, 2) + cleanPhoneNumber.slice(3);
    }
    return `55${cleanPhoneNumber}@c.us`;
  }

  //o arquivo deve estar em base64
  async sendImage(phoneNumber, base64Image, caption) {
    try {
      if (this.autenticated) {
        let chatId = this._getChatId(phoneNumber);
        const media = new MessageMedia("image/png", base64Image);
        await this._client.sendMessage(chatId, media, { caption: caption });
      } else {
        throw new Error(
          "Obrigatório estar autenticado para o envio de mensagem"
        );
      }
    } catch (e) {
      throw new Error(e.toString());
    }
  }
}

export default new WhatsappWebJS();
