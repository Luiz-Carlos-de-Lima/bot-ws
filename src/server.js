//Import de pacotes
import express from 'express';
import dotenv from 'dotenv';
import moment from 'moment';

import db from './config/db';
//Import das rotas
import WhatsappRouter from './routers/whatsappRouter';
import AuthRouter from './routers/authRouter';

//inicializacao das classes de rotas
const whatsappRouter = new WhatsappRouter();
const authRouter = new AuthRouter();

const app = express();
const env = dotenv.config().parsed;

const PORT = env.PORT;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

//ADD AS ROTAS DE CADA OBJ
app.use('/', whatsappRouter.router);
app.use('/', authRouter.router);

db(async _ => {
  app.listen(PORT, () => {
    let dataTemp = moment().format('DD/MM/YYYY HH:mm:ss');
    console.log('Servidor iniciado!', String(dataTemp));
  });
});

export default app;
