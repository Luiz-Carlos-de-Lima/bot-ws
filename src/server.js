//Import de pacotes
import express from 'express';
import dotenv from 'dotenv';

//Import das rotas
import WhatsappRouter from './routers/whatsappRouter';

//inicializacao das classes de rotas
const whatsappRouter = new WhatsappRouter();

const app = express();
const env = dotenv.config().parsed;

const PORT = env.PORT;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/', whatsappRouter.router);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});


export default app;
