import mongoose from "mongoose";
import Constants from "../constants/constants";

const CAMPAING_DAYS = Constants.CAMPAING_DAYS;

// Esquema para o cronograma de disparos
const ScheduleSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: [
      CAMPAING_DAYS.Monday,
      CAMPAING_DAYS.Tuesday,
      CAMPAING_DAYS.Wednesday,
      CAMPAING_DAYS.Thursday,
      CAMPAING_DAYS.Friday,
      CAMPAING_DAYS.Saturday,
      CAMPAING_DAYS.Sunday,
    ],
    required: true,
  },
  timeOfDay: {
    type: String,
    required: true, // Formato esperado: "HH:mm", por exemplo "14:30"
  },
  enable: {
    type: Boolean,
    default: false,
  },
});

// Esquema da campanha
const CampaingSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  listPhoneNumber: {
    type: [String], // Define que será um array de strings
    required: true,
  },
  caption: {
    type: String,
    required: true,
  },
  base64Image: {
    type: String,
  },
  enable: {
    type: Boolean,
    default: true,
  },
  // Campo para o cronograma associado à campanha
  schedule: {
    type: [ScheduleSchema],
    required: true,
  },
});

export default mongoose.model("Campaing", CampaingSchema);
