// Import de pacotes
import express from "express";
import dotenv from "dotenv";
import moment from "moment";
import http from "http"; // Adicionar o pacote HTTP padrão para criar o servidor

import db from "./config/db";
import socketIO from "./services/socketIO/socket";
// Import das rotas
import WhatsappRouter from "./routers/whatsappRouter";
import AuthRouter from "./routers/authRouter";
import CampaingRouter from "./routers/campaignRouter";
import AltomaticMessageRouter from "./routers/altomaticMessageRouter";

// Importar cron jobs
import { scheduleCronJobs } from "./crons/campaigns_cron"; // Importar a função de cron

// Inicialização das classes de rotas
const whatsappRouter = new WhatsappRouter();
const authRouter = new AuthRouter();
const campaingRouter = new CampaingRouter();
const altomaticMessageRouter = new AltomaticMessageRouter();

const app = express();
const env = dotenv.config().parsed;

const PORT = env.PORT;

// Criar o servidor HTTP
const server = http.createServer(app);

// Inicializar o Socket.IO com o servidor HTTP criado
socketIO.init(server);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204); // No content
  }

  next();
});

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Adicionar as rotas de cada objeto
app.use("/", whatsappRouter.router);
app.use("/", authRouter.router);
app.use("/", campaingRouter.router);
app.use("/", altomaticMessageRouter.router);

// Conectar ao banco de dados e iniciar o servidor
db(async (_) => {
  // Iniciar o servidor HTTP e Socket.IO juntos
  server.listen(PORT, () => {
    let dataTemp = moment().format("DD/MM/YYYY HH:mm:ss");
    console.log(`Servidor iniciado na porta ${PORT}!`, String(dataTemp));

    // Iniciar os cron jobs
    scheduleCronJobs();
  });
});

export default app;
