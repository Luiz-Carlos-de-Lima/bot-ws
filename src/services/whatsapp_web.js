import { Client, LocalAuth } from "whatsapp-web.js";

class WhatsappWebJS {
  qrCode = '';
  autenticated = false;

  _client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      // args: ['--proxy-server=proxy-server-that-requires-authentication.example.com'],
      headless: true,
    }
  });

  constructor () {
    this.generateQrCode();
    this._client.initialize();
  }

  generateQrCode() {
    this._client.on('qr', (qr) => {
      this.qrCode = qr;
    });
    this._client.on('authenticated', () => {
      console.log('authenticated');
      this.autenticated = true;
    });
    this._client.on('ready', () => {
      console.log('ready');
      this.autenticated = true;
    });
    this._client.on('auth_failure', () => {
      console.log('auth_failure');
      this.autenticated = false;
    });
    this._client.on('disconnected', (_) => {
      console.log('disconnected');
      this.autenticated = false;
    });

    this._client.on('message', async msg => {
    console.log('MESSAGE RECEIVED', msg);

    if (msg.body === '!ping reply') {
        // Send a new message as a reply to the current one
        msg.reply('pong');

    } else if (msg.body === '!ping') {
        // Send a new message to the same chat
        this._client.sendMessage(msg.from, 'pong');
    }
    });
  }

  async sendMessage(phoneNumber, message) {
    try {
      if (this.autenticated) {
        let cleanPhoneNumber = phoneNumber.replace(/[()\-\s]/g, '');
        if (cleanPhoneNumber.length == 11) {
          cleanPhoneNumber = cleanPhoneNumber.slice(0, 2) + cleanPhoneNumber.slice(3);
        }
        let chatId = `55${cleanPhoneNumber}@c.us`;
        await this._client.sendMessage(chatId, message);
      } else {
        throw new Error('Obrigatório estar autenticado para o envio de mensagem');
      }
    } catch (e) {
      throw new Error(e.toString());
    }
  }
}

export default new WhatsappWebJS();
