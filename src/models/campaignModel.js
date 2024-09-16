import mongoose from "mongoose";
import Constants  from "../constants/constants";

const CAMPAING_DAYS = Constants.CAMPAING_DAYS;

var ActivationDateSchema = mongoose.Schema({
  initDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
});

var ScheduleSchema = mongoose.Schema({
  validDays: {
    type: [String],
    enum: [CAMPAING_DAYS.Monday, CAMPAING_DAYS.Tuesday, CAMPAING_DAYS.Wednesday, CAMPAING_DAYS.Thursday, CAMPAING_DAYS.Friday, CAMPAING_DAYS.Saturday, CAMPAING_DAYS.Sunday],
    required: true
  },
  timeOfDay: { type: String, required: true },   // Horário de disparo, ex: "14:30"
});

var CampaingSchema = mongoose.Schema({
  description: { type: String, required: true },
  listPhoneNumber: { type: Array, required: true },
  caption: { type: String, required: true },
  base64Image: { type: String },
  enable: { type: Boolean, default: true }, // Corrigido para Boolean
  activationDate: { type: ActivationDateSchema, required: true }, // Mantido o esquema de ativação
  schedule: { type: ScheduleSchema, required: true }, // Novo campo para o cronograma
});

export default mongoose.model('campaing', CampaingSchema);
