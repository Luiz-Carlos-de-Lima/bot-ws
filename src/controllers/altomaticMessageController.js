import AltomaticMessage from "../models/altomaticMessage";
import nlp from "compromise";

export default class AltomaticMessageController {
  constructor() {
    this._validateInitialAltomaticMessage();
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

  async fetchMessages(id) {
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

  async _validateInitialAltomaticMessage() {
    const listPatternMessages = await AltomaticMessage.find({});
    if (!listPatternMessages.length) {
      await AltomaticMessage.collection(
        {
          description: "Informação sobre pedido",
          enable: true,
          pattern: true,
          sendMessage: "Realizar pedido",
          originalResponseMessage:
            "Você pode fazer o pedido no nosso app https://jclan-app.alphax.jclan.com.br/",
          responseMessage:
            "Você pode fazer o pedido no nosso app https://jclan-app.alphax.jclan.com.br/",
          intention: "FAZER_PEDIDO",
        },
        {
          description:
            "O que você deseja responder quando o cliente pergunta sobre o cardápio?",
          enable: true,
          pattern: true,
          sendMessage: "Me manda o cardápio",
          originalResponseMessage:
            "Aqui está o nosso cardápio: https://jclan-app.alphax.jclan.com.br/",
          responseMessage:
            "Aqui está o nosso cardápio: https://jclan-app.alphax.jclan.com.br/",
          intention: "VER_CARDAPIO",
        },
        {
          description: "Mensagem de resposta Olá, oi",
          enable: true,
          pattern: true,
          sendMessage: "Oi",
          originalResponseMessage: "Olá",
          responseMessage: "Olá",
          intention: "SAUDACAO_OI",
        },
        {
          description: "Mensagem de resposta Olá, oi",
          enable: true,
          pattern: true,
          sendMessage: "Oi",
          originalResponseMessage: "Olá",
          responseMessage: "Olá",
          intention: "SAUDACAO_OI",
        },
        {
          description: "Mensagem de resposta para agradecimento",
          enable: true,
          pattern: true,
          sendMessage: "Obrigado",
          originalResponseMessage: "De nada",
          responseMessage: "De nada",
          intention: "AGRADECIMENTO",
        },
        {
          description: "Informação quando pedido for realizado com sucesso",
          enable: true,
          pattern: true,
          sendMessage: "",
          originalResponseMessage:
            "Vim avisar que o seu pedido foi realizado com sucesso e está em análise! Vou te atualizando sobre o status do pedido por aqui",
          responseMessage:
            "Vim avisar que o seu pedido foi realizado com sucesso e está em análise! Vou te atualizando sobre o status do pedido por aqui",
          intention: "PEDIDO_ENVIADO",
        },
        {
          description: "Informação quando o pedido está em produção",
          enable: true,
          pattern: true,
          sendMessage: "",
          originalResponseMessage:
            "Só pra dizer que o seu pedido está em produção ",
          responseMessage: "Só pra dizer que o seu pedido está em produção ",
          intention: "STATUS_PRODUCAO",
        },
        {
          description: "Informação quando o pedido saiu para entrega",
          enable: true,
          pattern: true,
          sendMessage: "",
          originalResponseMessage: "Obaaa! seu pedido saiu para entrega!",
          responseMessage: "Obaaa! seu pedido saiu para entrega!",
          intention: "STATUS_EM_ENTREGA",
        },
        {
          description: "Informação para cliente vir comer o pedido",
          enable: true,
          pattern: true,
          sendMessage: "",
          originalResponseMessage:
            "Obaa! seu pedido está pronto e está aqui te esperando!",
          responseMessage:
            "Obaa! seu pedido está pronto e está aqui te esperando!",
          intention: "STATUS_COMER_PEDIDO",
        },
        {
          description: "Informação para cliente vir buscar o pedido",
          enable: true,
          pattern: true,
          sendMessage: "",
          originalResponseMessage:
            "Notícia boaaa seu pedido está pronto, é só vir buscar!",
          responseMessage:
            "Notícia boaaa seu pedido está pronto, é só vir buscar!",
          intention: "STATUS_BUSCAR_PEDIDO",
        }
      );
    }
  }
}
