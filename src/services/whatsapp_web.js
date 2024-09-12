import { Client } from "whatsapp-web.js";
import   AlphaxLocalAuth  from "../authStrategies/alphaxLocalAuth";
import fs from "fs";
import path from "path";
import Utils from "../utils/utils";

class WhatsappWebJS {
  qrCode = "";
  autenticated = false;

  _client = null;

  constructor() {

    this._init();
  }

   _init() {
    this._client = null;
    this._client = new Client({
      authStrategy: new AlphaxLocalAuth(),
      puppeteer: {
        headless: true,
        args: [
          '--no-sandbox',
          '--no-experiments',
          '--hide-scrollbars',
          '--disable-plugins',
          '--disable-infobars',
          '--disable-translate',
          '--disable-pepper-3d',
          '--disable-extensions',
          '--disable-dev-shm-usage',
          '--disable-notifications',
          '--disable-setuid-sandbox',
          '--disable-crash-reporter',
          '--disable-smooth-scrolling',
          '--disable-login-animations',
          '--disable-dinosaur-easter-egg',
          '--disable-accelerated-2d-canvas',
          '--disable-rtc-smoothness-algorithm'
        ],
      },
    });
    this.qrCode = "";
    this.autenticated = false;
    this.generateQrCode();
    this._client
      .initialize()
      .then((e) => console.log("Robo Iniciado"))
      .catch((e) => {
        console.log('Erro ao iniciar o robo');
        console.log(e);
        this._init();
      });
  }

  generateQrCode() {
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
      await Utils.delay(2000);
      this._init();
      // await this._deleteFolders();
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
        let cleanPhoneNumber = phoneNumber.replace(/[()\-\s]/g, "");
        if (cleanPhoneNumber.length == 11) {
          cleanPhoneNumber =
            cleanPhoneNumber.slice(0, 2) + cleanPhoneNumber.slice(3);
        }
        let chatId = `55${cleanPhoneNumber}@c.us`;
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

  async _deleteFolders() {
    try {
      if (
        this._client.pupBrowser?.isConnected() &&
        !this._client.pupPage?.isClosed()
      ) {
        if (this.autenticated) {
          await this._client.logout();
        }
        await this._client.destroy();

      }

      // this._init();
      console.log("Pasta apagada com sucesso!");
    } catch (err) {
      console.error("Erro ao apagar a pasta:", err);
    }
  }
}

export default new WhatsappWebJS();
