import { Router } from 'express';
import WhatsappController  from '../controllers/whatsappController';

export default class WhatsappRouter {
  whatsappController = new WhatsappController();

  router = Router();

  constructor() {
    this.iniciarRobo();
  }

  iniciarRobo () {
    this.router.get('/iniciarRobo', (req, res) => {
      console.log('Passou aqui');
      res.send({teste: 'teste'});
    });
    }
}



