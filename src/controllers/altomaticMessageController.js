import nlp from "compromise";
import AltomaticMessage from "../models/altomaticMessage";

export default class AltomaticMessageController {
  constructor() {
    this._validateInitialAltomaticMessage();
  }

  async _validateInitialAltomaticMessage() {
    const listPatternMessages = await AltomaticMessage.find({});
    if (!listPatternMessages) {
      AltomaticMessage.createCollection(
        {
          description: "Mensagem de resposta Olá, oi",
          enable: true,
          pattern: true,
          sendMessage: "Oi",
          originalResponseMessage: "Olá",
          responseMessage: "Olá",
          custom: false,
          intention: "SAUDACAO_OI",
        },
        {
          description: "Mensagem de fazer um pedido",
          enable: true,
          pattern: true,
          sendMessage: "Gostaria de fazer um pedido",
          responseMessage:
            "Aqui está o nosso cardápio: https://jclan-app.alphax.jclan.com.br/",
          originalResponseMessage:
            "Aqui está o nosso cardápio: https://jclan-app.alphax.jclan.com.br/",
          custom: false,
          intention: "FAZER_PEDIDO",
        }
      );
    }
  }

  async controlMessage(message) {
    const doc = nlp(String(message).toLowerCase());

    const findResponseByIntention = async (intention) => {
      try {
        const response = await AltomaticMessage.findOne({
          intention,
          enable: true,
        });
        return response ? response.responseMessage : "";
      } catch (error) {
        console.error("Erro ao buscar a resposta:", error);
        return "Ocorreu um erro ao processar sua mensagem.";
      }
    };

    if (
      doc.has("cardápio") ||
      doc.has("cardapio") ||
      doc.has("menu") ||
      doc.has("pedido")
    ) {
      return await findResponseByIntention("FAZER_PEDIDO");
    } else if (
      doc.has("oi") ||
      doc.has("olá") ||
      doc.has("ola") ||
      doc.has("opa")
    ) {
      return await findResponseByIntention("SAUDACAO_OI");
    }
  }

  async getMessage() {
    const listMessage = await AltomaticMessage.find();
    return listMessage;
  }

  async getMessageById(id) {
    const altomaticMessage = await AltomaticMessage.findById(id);
    return altomaticMessage;
  }

  async createMessage(data) {
    const altomatiMessageObj = new AltomaticMessage(data);
    await altomatiMessageObj.save();
  }

  async deleteMessage(id) {
    await AltomaticMessage.deleteOne({ _id: id });
  }

  async updateMessage(id, data) {
    return await AltomaticMessage.findByIdAndUpdate(id, data);
  }

  
}
