import dotenv from 'dotenv';
import moment from 'moment';
import mongoose from 'mongoose';

import Utils from '../utils/utils';


moment.locale('pt-BR');

const env = dotenv.config().parsed;

var db = mongoose.connection;

var tentativasConexao = 0;

export default async function (callback) {
  db.on('connecting', () => {
    console.log('connecting to MongoDB...');
  });

  db.on('error', (error) => {
    console.log('ERROR in MongoDb connection: ' + moment().format(), Utils.trataMensagemErrorTry(error));
    mongoose.disconnect().then(async () => {
      tentativasConexao++;
      console.log('Aguardando 5 segundo para nova conexão: ' + tentativasConexao);
      await Utils.delay(5000);
      try {
        if (tentativasConexao < 10) {
          mongoose.connect(env.DB_CONNECTION).catch(() => {
            // o catch aqui serve apenas para nao ficar printando o erro no console, mesmo com o try, ele printava o erro completo
            // aqui ele tenta por padrão 30 segundos, se passar disso, estoura os eventos conforme acontecem, disconnected, error, etc...
          });
        } else {
          db.destroy().then(async () => {
            console.log('CONEXÃO DESTRUIDA', 'TENTATIVAS = ' + tentativasConexao);
            console.log('PARANDO PROCESSO NODE E TENTATIVA RESTART AUTOMATICO PM2');
            await Utils.delay(10000);
            console.log('restartando servicos');
            process.exit();
          })
            .catch((err) => {
              console.log('FALHA AO TENTAR DESTRUIR A CONEXÇÃO', Utils.trataMensagemErrorTry(err));
            });
        }
      } catch (error1) {
        console.log('\x1b[31m%s\x1b[0m', 'reconnectFailed - Falha na reconexão, ', Utils.trataMensagemErrorTry(error1));
      }
    }).catch((err) => {
      console.log('\x1b[31m%s\x1b[0m', 'Erro na mongoose.disconnect, provavel que não exista mais conexão por já estar fechado! ' + moment().format() + '\n', Utils.trataMensagemErrorTry(err));
    });
  });

  db.on('connected', () => {
    tentativasConexao = 0;
    console.log('MongoDB connected!', moment().format());
  });
  db.once('open', () => {
    tentativasConexao = 0;
    console.log('MongoDB connection opened!');
  });
  db.on('reconnected', () => {
    tentativasConexao = 0;
    console.log('MongoDB reconnected!', moment().format());
  });
  db.on('disconnected', () => {
    console.log('MongoDB disconnected!', moment().format());
  });
  db.on('close', () => {
    console.log('MongoDB close!', moment().format());
  });

  // adicionado 21022023 devido a aviso de padrão apartir da versao 7 do mongoose
  mongoose.set('strictQuery', false);

  try {
    mongoose.connect(env.DB_CONNECTION).catch(() => {
      // o catch aqui serve apenas para nao ficar printando o erro no console, mesmo com o try, ele printava o erro completo
      // aqui ele tenta por padrão 30 segundos, se passar disso, estoura os eventos conforme acontecem, disconnected, error, etc...
    });
  } catch (erro) {
    console.log('\x1b[31m%s\x1b[0m', 'Principal - reconnectFailed - Falha na reconexão ', Utils.trataMensagemErrorTry(erro));
  }
  callback();
}
