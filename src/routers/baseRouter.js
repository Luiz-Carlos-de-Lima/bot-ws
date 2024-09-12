import Utils from "../utils/utils";

export default class BaseRouter {
  ok (data, res) {
    if (res) {
      res.json({ valido: true, data: data });
    } else {
      return { valido: true, data: data };
    }
  };

 fail (error, res) {
    try {
      // tive que fazer um JSON.parse pq sem ele não tem acesso ao objeto e não conseguia verificar se existia a propriedade message
      // para quase 100% dos casos existe o message, a validação abaixo continua fazendo a mesma forma, só estou mandando o objeto
      // com alteração caso eu verifique que não exista o propriedade message.
      // OBS. caso que nao estava vindo o message é o erro de duplicateKey do mongo ao tentar criar um novo objeto como o mesmo _id
      let usarErrorTemp = false;
      let errorTemp = JSON.parse(JSON.stringify(error));
      if (!errorTemp.message || '') {
        if (errorTemp.errmsg || '') {
          errorTemp.message = errorTemp.errmsg;
          usarErrorTemp = true;
        }
      }
      if (usarErrorTemp) {
        if (res) {
          res.json({ valido: false, data: errorTemp });
        } else {
          return { valido: false, data: errorTemp };
        }
      } else {
        if (res) {
          res.json({ valido: false, data: error });
        } else {
          return { valido: false, data: error };
        }
      }
    } catch (error) {
      if (res) {
        let message = Utils.trataMensagemErrorTry(error);
        res.json({ valido: false, data: { message: message } });
      } else {
        return { valido: false, data: { message: String(error) } };
      }
    }
  };
}
