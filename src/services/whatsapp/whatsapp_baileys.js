import { Client, MessageMedia } from "whatsapp-web.js";
import puppeteer from "puppeteer";
import WhatsappWebBase from "./whatsappBase";
import AlphaxLocalAuth from "../../authStrategies/alphaxLocalAuth";
import Utils from "../../utils/utils";
import makeWASocket from '@whiskeysockets/baileys'

class WhatsappWebBayleys extends WhatsappWebBase {
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
  _browser;

  _client = new Client();

  constructor() {
    super();
    this._init();
  }

  async connectToWhatsApp() {
    const sock = makeWASocket({
      printQRInTerminal: true
    });
    sock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect } = update
      if (connection === 'close') {
        const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut
        console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect)
        if (shouldReconnect) {
          connectToWhatsApp()
        }
      } else if (connection === 'open') {
        console.log('opened connection')
      }
    })
  }


  async _init() {
    this.connectToWhatsApp();
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

    this._client.on("message_received", (msg) => {
      console.log("mensagem recebida", msg);
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

    this._client.on("message_ack", async (msg) => {
      console.log("Confirmação de mensagem", msg);
      if (typeof this._callbackMessageAck === "function") {
        let message = { ...msg, quotedMsg: null };
        if (message.hasQuotedMsg) {
          let quotedMsg = await msg.getQuotedMessage();
          message.quotedMsg = quotedMsg;
        }
        this._callbackMessageAck(message);
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
        let message = { ...msg, quotedMsg: null };
        if (message.hasQuotedMsg) {
          let quotedMsg = await msg.getQuotedMessage();
          message.quotedMsg = quotedMsg;
        }
        let responseMessage = await this._callbackMessage(message);
        if (responseMessage) {
          this._client.sendMessage(message.from, responseMessage);
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
          await this.stopStateTyping(chatId);
          return await this._client.sendMessage(chatId, message);
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

  async replyMessage(content, chatId, messageId) {
    try {
      let editedMessage = null;
      if (this.autenticated) {
        let message = await this.getMessage(messageId);

        if (message != null) {
          let replyMessage = await message.reply(content, chatId);
          let quotedMsg = {};
          if (replyMessage.hasQuotedMsg) {
            quotedMsg.quotedMsg = message;
          }
          return { ...replyMessage, ...quotedMsg };
        }
      }

      return editedMessage;
    } catch (_) {
      return null;
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
          return await this._client.sendMessage(chatId, media, {
            caption: caption,
          });
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

  async sendMedia(chatId, base64Data, caption, mimeType) {
    try {
      if (this.autenticated) {
        if (chatId) {
          const media = new MessageMedia(mimeType, base64Data);
          return await this._client.sendMessage(chatId, media, {
            caption: caption,
          });
        }
      } else {
        throw new Error(
          "Obrigatório estar autenticado para o envio de mensagem de media"
        );
      }
    } catch (e) {
      throw new Error(e.toString());
    }
  }

  async sendContact(chatId, contacts) {
    try {
      if (this.autenticated) {
        if (chatId) {
          let listContacts = [];
          let promises = contacts.map((contact) =>
            new Promise(async (resolve) => {
              if (contact != null && contact.id != null) {
                let newContact = await this.getContactById(
                  contact.id._serialized
                );
                resolve(newContact);
              }
            }).then((contact) => listContacts.push(contact))
          );
          await Promise.all(promises);
          if (listContacts.length == 1) {
            return await this._client.sendMessage(chatId, listContacts[0]);
          }

          return await this._client.sendMessage(chatId, listContacts);
        }
      } else {
        throw new Error(
          "Obrigatório estar autenticado para o envio de contatos"
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
      let promises = [];
      let chatsTemp = await this._client.getChats();
      promises = chatsTemp
        .filter((chat) => chat.lastMessage)
        .map((chat) =>
          new Promise(async (resolve) => {
            let chatTemp = JSON.parse(JSON.stringify(chat));
            if (
              chat.lastMessage.type == "gp2" ||
              chat.lastMessage.type.toString().includes("notification") ||
              chat.lastMessage.type == "call_log"
            ) {
              let listMessage = await chat.fetchMessages({
                limit: 2,
              });
              chatTemp.lastMessage = listMessage.shift();
            }
            resolve(chatTemp);
          }).then((chat) => {
            chats.push(chat);
          })
        );

      await Promise.all(promises);
    }
    return chats;
  }

  async fetchMessages(chatId) {
    try {
      let chatMessage = [];
      let promises = [];

      if (this.autenticated) {
        let chat = await this._client.getChatById(chatId);
        let listMessage = await chat.fetchMessages({
          limit: 50,
        });

        promises = listMessage
          .filter((message) => message.type !== "call_log")
          .map(
            (message) =>
              new Promise(async (resolve) => {
                try {
                  let promisesMessage = [];
                  if (message.hasQuotedMsg) {
                    promisesMessage.push(message.getQuotedMessage().then((value) => {
                      message["quotedMsg"] = value;
                    }));
                  }

                  if (message.hasReaction) {
                    promisesMessage.push(message.getReactions().then((value) => {
                      message['reaction'] = value;
                    }));
                  }

                  if (promisesMessage.length > 0) {
                    await Promise.all(promisesMessage);
                  }

                  resolve(message);
                } catch (_) {
                  resolve(message);
                }
              })
          );

        chatMessage = await Promise.all(promises);
      }

      return chatMessage;
    } catch (_) {
      return [];
    }
  }



  async getMessageMedia(messageId) {
    try {
      if (this.autenticated) {
        if (messageId) {
          let message = await this._client.getMessageById(messageId);
          if (message.hasMedia) {
            return await message.downloadMedia();
          }
        }
      }
      return null;
    } catch (_) {
      return null;
    }
  }

  async getContacts() {
    let contacts = [];

    if (this.autenticated) {
      contacts = await this._client.getContacts();
    }

    return contacts
      .filter(
        (contact) =>
          contact != null &&
          contact.id != null &&
          contact.id.server !== "lid" &&
          contact.isUser &&
          (contact.isMe || contact.isMyContact) &&
          contact.isWAContact &&
          !contact.isGroup
      )
      .sort((a, b) => {
        let nameA = a.name || "";
        let nameB = b.name || "";
        if (a.isMe && !b.isMe) return -1;
        if (Utils.isNumber(nameA) && !Utils.isNumber(nameB)) return -1;
        if (!Utils.isNumber(nameA) && Utils.isNumber(nameB)) return 1;

        if (Utils.isSpecialChar(nameA) && !Utils.isSpecialChar(nameB))
          return -1;
        if (!Utils.isSpecialChar(nameA) && Utils.isSpecialChar(nameB)) return 1;

        return nameA.localeCompare(nameB, undefined, { sensitivity: "base" });
      });
  }

  async getChatById(chatId) {
    let chat = null;
    if (this.autenticated) {
      const chatTemp = await this._client.getChatById(chatId);
      chatTemp['labels'] = await chatTemp.getLabels();

      chat = chatTemp;
    }

    return chat;
  }

  async getContactById(contactId) {
    let contact = null;
    if (this.autenticated) {
      let contactTemp = await this._client.getContactById(contactId);
      let about = await contactTemp.getAbout();
      contact = { ...contactTemp, 'about': about };
    }

    return contact;
  }

  async archiveChat(chatId) {
    let archived = false;
    if (this.autenticated) {
      let chat = await this.getChatById(chatId);
      if (chat.archived) {
        archived = await chat.unarchive();
      } else {
        archived = await chat.archive();
      }
    }

    return archived;
  }

  async pinnedChat(chatId) {
    let pinned = false;
    if (this.autenticated) {
      let chat = await this.getChatById(chatId);
      if (chat.pinned) {
        pinned = await chat.unpin();
      } else {
        pinned = await chat.pin();
      }
    }

    return pinned;
  }

  async deleteChat(chatId) {
    let deleted = false;
    if (this.autenticated) {
      let chat = await this.getChatById(chatId);
      deleted = await chat.delete();
    }

    return deleted;
  }

  async markUnread(chatId) {
    let unreadCount = -1;
    if (this.autenticated) {
      let chat = await this.getChatById(chatId);
      await chat.markUnread();
      unreadCount = chat.unreadCount;
    }

    return unreadCount;
  }

  async sendSeen(chatId) {
    let sendSen = 1;
    if (this.autenticated) {
      let chat = await this.getChatById(chatId);
      await chat.sendSeen();
      sendSen = chat.unreadCount;
    }

    return sendSen;
  }

  async getMessage(messageId) {
    try {
      if (messageId) {
        let message = await this._client.getMessageById(messageId);

        let promisesMessage = [];
        if (message.hasQuotedMsg) {
          promisesMessage.push(message.getQuotedMessage().then((value) => {
            message["quotedMsg"] = value;
          }));
        }

        if (message.hasReaction) {
          promisesMessage.push(message.getReactions().then((value) => {
            message['reaction'] = value;
          }));
        }

        if (promisesMessage.length > 0) {
          await Promise.all(promisesMessage);
        }

        return message;
      }

      return null;
    } catch (_) {
      return null;
    }
  }

  async pinMessage(messageId, duration) {
    try {
      let pinned = false;
      if (this.autenticated) {
        let message = await this.getMessage(messageId);

        if (message != null) {
          pinned = await message.pin(duration);
        }
      }

      return pinned;
    } catch (_) {
      return false;
    }
  }

  async reactMessage(messageId, reaction) {
    try {
      let reactionMessage = false;
      if (this.autenticated) {
        let message = await this.getMessage(messageId);

        if (message != null) {
          await message.react(reaction);
          reactionMessage = true;
        }
      }

      return await this.getMessage(messageId);
    } catch (_) {
      return null;
    }
  }

  async deleteMessage(messageId, everyone) {
    try {
      let deletedMessage = false;
      if (this.autenticated) {
        let message = await this.getMessage(messageId);
        if (message != null) {
          await message.delete(everyone);
          return true;
        }
      }

      return deletedMessage;
    } catch (_) {
      return false;
    }
  }

  async editMessage(messageId, content) {
    try {
      let editedMessage = null;
      if (this.autenticated) {
        let message = await this.getMessage(messageId);

        if (message != null) {
          return await message.edit(content);
        }
      }

      return editedMessage;
    } catch (_) {
      return null;
    }
  }

  async forwardMessage(messageId, chatIdForward) {
    try {
      let forward = false;
      if (this.autenticated) {
        let message = await this.getMessage(messageId);

        if (message != null) {
          await message.forward(chatIdForward);
          forward = true;
        }
      }

      return forward;
    } catch (_) {
      return false;
    }
  }

  async clearMessage(chatId) {
    let clearMessage = false;
    if (this.autenticated) {
      let chat = await this.getChatById(chatId);
      clearMessage = await chat.clearMessages();
    }

    return clearMessage;
  }

  async sendStateTyping(chatId) {
    try {
      let sendStateTyping = false;
      if (this.autenticated) {
        let chat = await this.getChatById(chatId);
        await chat.sendStateTyping();
        sendStateTyping = true;
      }

      return sendStateTyping;
    } catch (_) {
      return false;
    }
  }

  async stopStateTyping(chatId) {
    try {
      let sendStateTyping = false;
      if (this.autenticated) {
        let chat = await this.getChatById(chatId);
        console.log("chat clear Message", chat);
        sendStateTyping = await chat.clearState();
      }

      return sendStateTyping;
    } catch (_) {
      return false;
    }
  }
}

export default new WhatsappWebJS();
