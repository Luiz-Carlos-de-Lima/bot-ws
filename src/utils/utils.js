export default class Utils {
  static delay(ms) {
    return new Promise((_) => setTimeout(_, ms));
  }

  static formatDateToISO(dateString) {
    // 1. Separar dia, mês e ano da string no formato DD/MM/YYYY
    const [day, month, year] = dateString.split('/').map(Number);

    // 2. Criar o objeto `Date` ajustado para o fuso horário UTC-3
    const date = new Date(year, month - 1, day, 0, 0, 0); // 00:00 no horário local
    const offsetInMinutes = -3 * 60; // Offset UTC-3 em minutos
    const localDate = new Date(date.getTime() - offsetInMinutes * 60 * 1000); // Ajustar para UTC-3

    // 3. Retornar no formato ISO
    return localDate.toISOString();
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
