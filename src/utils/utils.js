export default class Utils {
  static delay(ms) {
    return new Promise((_) => setTimeout(_, ms));
  }

  static tokenRandom(tamanho) {
    let caracteres = "0123456789";
    let resultado = "";

    for (let i = 0; i < tamanho; i++) {
      let indiceAleatorio = Math.floor(Math.random() * caracteres.length);
      resultado += caracteres[indiceAleatorio];
    }

    return resultado;
  }

  static isNumber(char) {
    return /^[0-9]$/.test(char);
  }
  static isSpecialChar(char) {
    return /^[^a-zA-Z0-9]$/.test(char);
  }

  static trataMensagemErrorTry(obj) {
    try {
      let mensagem = "";
      if (obj) {
        if (obj.message) {
          mensagem = String(obj.message);
        } else {
          mensagem =
            obj && obj.error
              ? obj.error.message
                ? String(obj.error.message)
                : String(obj.error)
              : String(obj);
          if (
            obj &&
            (obj instanceof ReferenceError ||
              obj instanceof TypeError ||
              obj instanceof EvalError ||
              obj instanceof RangeError)
          ) {
            mensagem = String(obj);
          }
        }
      }
      return mensagem;
    } catch (error) {
      return String("Falha ao capturar o erro" + trataMensagemErrorTry(error));
    }
  }
}
