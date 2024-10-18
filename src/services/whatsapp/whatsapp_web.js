import { Client, MessageMedia } from "whatsapp-web.js";
import WhatsappWebBase from "./whatsappBase";
import AlphaxLocalAuth from "../../authStrategies/alphaxLocalAuth";

class WhatsappWebJS extends WhatsappWebBase {
  qrCode = "";
  autenticated = false;
  _callbackMessage;
  _callbackQrCode;
  _callbackAuthenticated;
  _callbackDisconnected;
  _callbackReady;
  _callbackMessageCreate;
  _callbackMessageAck;
  _callbackMessageRevokeMe;
  _callbackAuthFailure;
  _callbackChatRemoved;
  _callbackChatArchived;
  _callbackMessageCiphertext;
  _callbackMessageRevokedEveryone;
  _callbackMessageEdit;
  _callbackUnreadCount;
  _callbackMessageReaction;
  _callbackMediaUploaded;
  _callbackContactChanged;
  _callbackGroupJoin;
  _callbackGroupLeave;
  _callbackGroupAdminChanged;
  _callbackGroupMembershipRequest;
  _callbackGroupUpdate;
  _callbackQrReceived;
  _callbackLoadingScreen;
  _callbackStateChanged;
  _callbackBatteryChanged;
  _callbackIncomingCall;
  _callbackRemoteSessionSaved;
  _callbackVoteUpdate;

  _client = new Client();

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

  onMessage(callback) {
    this._callbackMessage = callback;
  }

  onMessageCreate(callback) {
    this._callbackMessageCreate = callback;
  }

  onMessageAck(callback) {
    this._callbackMessageAck = callback;
  }

  onMessageRevokedEveryone(callback) {
    this._callbackMessageRevokedEveryone = callback;
  }

  onMessageRevokeMe(callback) {
    this._callbackMessageRevokeMe = callback;
  }

  onMediaUploaded(callback) {
    this._callbackMediaUploaded = callback;
  }

  onQrCode(callback) {
    this._callbackQrCode = callback;
  }

  onAuthenticated(callback) {
    this._callbackAuthenticated = callback;
  }

  onAuthFailure(callback) {
    this._callbackAuthFailure = callback;
  }

  onReady(callback) {
    this._callbackReady = callback;
  }

  onDisconnected(callback) {
    this._callbackDisconnected = callback;
  }

  onGroupJoin(callback) {
    this._callbackGroupJoin = callback;
  }

  onGroupLeave(callback) {
    this._callbackGroupLeave = callback;
  }

  onGroupUpdate(callback) {
    this._callbackGroupUpdate = callback;
  }

  onContactChanged(callback) {
    this._callbackContactChanged = callback;
  }

  onChatRemoved(callback) {
    this._callbackChatRemoved = callback;
  }

  onChatArchived(callback) {
    this._callbackChatArchived = callback;
  }

  onMessageCiphertext(callback) {
    this._callbackMessageCiphertext = callback;
  }

  onMessageEdit(callback) {
    this._callbackMessageEdit = callback;
  }

  onUnreadCount(callback) {
    this._callbackUnreadCount = callback;
  }

  onMessageReaction(callback) {
    this._callbackMessageReaction = callback;
  }

  onMediaUploaded(callback) {
    this._callbackMediaUploaded = callback;
  }

  onGroupAdminChanged(callback) {
    this._callbackGroupAdminChanged = callback;
  }

  _generateQrCode() {
    this._client.on("qr", (qr) => {
      console.log("Generate qr code");
      this.qrCode = qr;
      if (typeof this._callbackQrCode === "function") {
        this._callbackQrCode(this.qrCode);
      }
    });
    this._client.on("authenticated", () => {
      console.log("authenticated");
      this.autenticated = true;
      if (typeof this._callbackAuthenticated === "function") {
        this._callbackAuthenticated();
      }
    });
    this._client.on("ready", () => {
      console.log("ready");
      this.autenticated = true;
      if (typeof this._callbackReady === "function") {
        this._callbackReady();
      }
    });
    this._client.on("auth_failure", async () => {
      console.log("auth_failure");
      this.autenticated = false;
    });

    this._client.on("disconnected", async (_) => {
      console.log("disconnected");
      await this._disableValuesWhatsapp();
      if (typeof this._callbackDisconnected === "function") {
        this._callbackDisconnected();
      }
    });

    this._client.on("chat_removed", (data) => {
      console.log("Chat removido");
      if (typeof this._callbackChatRemoved === "function") {
        this._callbackChatRemoved(data);
      }
    });

    this._client.on("chat_archived", (data) => {
      console.log("Chat arquivado");
      if (typeof this._callbackChatArchived === "function") {
        this._callbackChatArchived(data);
      }
    });

    this._client.on("message_ciphertext", (msg) => {
      console.log("Mensagem criptografada", msg);
      if (typeof this._callbackMessageCiphertext === "function") {
        this._callbackMessageCiphertext(msg);
      }
    });

    this._client.on("message_revoked_everyone", (msg) => {
      console.log("Mensagem revogada para todos", msg);
      if (typeof this._callbackMessageRevokedEveryone === "function") {
        this._callbackMessageRevokedEveryone(msg);
      }
    });

    this._client.on("message_revoked_me", (msg) => {
      console.log("Mensagem revogada para mim", msg);
      if (typeof this._callbackMessageRevokeMe === "function") {
        this._callbackMessageRevokeMe(msg);
      }
    });

    this._client.on("message_ack", (msg) => {
      console.log("Confirmação de mensagem", msg);
      if (typeof this._callbackMessageAck === "function") {
        this._callbackMessageAck(msg);
      }
    });

    this._client.on("message_edit", (msg) => {
      console.log("Mensagem editada", msg);
      if (typeof this._callbackMessageEdit === "function") {
        this._callbackMessageEdit(msg);
      }
    });

    this._client.on("unread_count", (count) => {
      console.log("Contagem de não lidos", count);
      if (typeof this._callbackUnreadCount === "function") {
        this._callbackUnreadCount(count);
      }
    });

    this._client.on("message_reaction", (reaction) => {
      console.log("Reação a mensagem", reaction);
      if (typeof this._callbackMessageReaction === "function") {
        this._callbackMessageReaction(reaction);
      }
    });

    this._client.on("media_uploaded", (media) => {
      console.log("Mídia enviada", media);
      if (typeof this._callbackMediaUploaded === "function") {
        this._callbackMediaUploaded(media);
      }
    });

    this._client.on("contact_changed", (contact) => {
      console.log("Contato alterado", contact);
      if (typeof this._callbackContactChanged === "function") {
        this._callbackContactChanged(contact);
      }
    });

    this._client.on("group_join", (notification) => {
      console.log("Alguém entrou no grupo", notification);
      if (typeof this._callbackGroupJoin === "function") {
        this._callbackGroupJoin(notification);
      }
    });

    this._client.on("group_leave", (notification) => {
      console.log("Alguém saiu do grupo", notification);
      if (typeof this._callbackGroupLeave === "function") {
        this._callbackGroupLeave(notification);
      }
    });

    this._client.on("group_admin_changed", (notification) => {
      console.log("Admin do grupo mudou", notification);
      if (typeof this._callbackGroupAdminChanged === "function") {
        this._callbackGroupAdminChanged(notification);
      }
    });

    this._client.on("group_membership_request", (request) => {
      console.log("Solicitação de participação no grupo", request);
      if (typeof this._callbackGroupMembershipRequest === "function") {
        this._callbackGroupMembershipRequest(request);
      }
    });

    this._client.on("group_update", (group) => {
      console.log("Grupo atualizado", group);
      if (typeof this._callbackGroupUpdate === "function") {
        this._callbackGroupUpdate(group);
      }
    });

    this._client.on("qr_received", (qr) => {
      console.log("QR Code recebido", qr);
      if (typeof this._callbackQrReceived === "function") {
        this._callbackQrReceived(qr);
      }
    });

    this._client.on("loading_screen", (data) => {
      console.log("Tela de carregamento", data);
      if (typeof this._callbackLoadingScreen === "function") {
        this._callbackLoadingScreen(data);
      }
    });

    this._client.on("state_changed", (state) => {
      console.log("Estado alterado", state);
      if (typeof this._callbackStateChanged === "function") {
        this._callbackStateChanged(state);
      }
    });

    this._client.on("battery_changed", (battery) => {
      console.log("Bateria alterada", battery);
      if (typeof this._callbackBatteryChanged === "function") {
        this._callbackBatteryChanged(battery);
      }
    });

    this._client.on("incoming_call", (call) => {
      console.log("Chamada recebida", call);
      if (typeof this._callbackIncomingCall === "function") {
        this._callbackIncomingCall(call);
      }
    });

    this._client.on("remote_session_saved", () => {
      console.log("Sessão remota salva");
      if (typeof this._callbackRemoteSessionSaved === "function") {
        this._callbackRemoteSessionSaved();
      }
    });
    this._client.on("vote_update", (vote) => {
      console.log("Voto atualizado", vote);
      if (typeof this._callbackVoteUpdate === "function") {
        this._callbackVoteUpdate(count);
      }
    });

    this._client.on("message", async (msg) => {
      if (typeof this._callbackMessage === "function") {
        let responseMessage = await this._callbackMessage(msg);
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

  async getProfilePicUrl(contactId) {
    let imageProfile = "";
    if (this.autenticated) {
      imageProfile = await this._client.getProfilePicUrl(contactId);
    }

    return imageProfile;
  }

  async getChats() {
    let chats = [];
    if (this.autenticated) {
      chats = await this._client.getChats();
    }

    return chats;
  }

  async fetchMessages(chatId) {
    let chatMessage = [];

    if (this.autenticated) {
      let chat = await this._client.getChatById(chatId);
      chatMessage = await chat.fetchMessages({
        limit: 50,
      });
    }

    return chatMessage;
  }

  async getContacts() {
    let contacts = [];

    if (this.autenticated) {
      contacts = await this._client.getContacts();
    }

    return contacts;
  }

  async archiveChat(chatId) {
    if (this.autenticated) {
      let chat = await this._client.getChatById(chatId);
      if (chat.archived) {
        await chat.unarchive();
      } else {
        await chat.archive();
      }

      return chat.archived;
    }

    return false;
  }

  async pinnedChat(chatId) {
    if (this.autenticated) {
      let chat = await this._client.getChatById(chatId);
      if (chat.pinned) {
        await chat.unpin();
      } else {
        await chat.pin();
      }

      return chat.pinned;
    }

    return false;
  }

  async deleteChat(chatId) {
    if (this.autenticated) {
      let chat = await this._client.getChatById(chatId);
      return await chat.delete();
    }

    return false;
  }
}

export default new WhatsappWebJS();
