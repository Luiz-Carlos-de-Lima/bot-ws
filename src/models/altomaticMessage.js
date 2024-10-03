import mongoose from "mongoose";

const AltomaticMessageScheme = new mongoose.Schema({
  description: { type: String, required: true },
  sendMessage: { type: String, required: true },
  responseMessage: { type: String, required: true },
  originalResponseMessage: { type: String, required: true },
  pattern: {
    type: Boolean,
    default: false,
  },
  modified: {
    type: Boolean,
    default: false,
  },
  enable: {
    type: Boolean,
    default: true,
  },
  intention: {
    type: String,
    enum: [
      "FAZER_PEDIDO",
      "SAUDACAO_OI",
      "SUPORTE_TECNICO",
      "AGENDAMENTO",
      "OUTRO",
    ],
    required: true,
  },
});

export default mongoose.model("AltomaticMessage", AltomaticMessageScheme);
