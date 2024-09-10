const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  // Obter o token dos cabeçalhos da requisição
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).send('Token não fornecido.');
  }

  // Verificar e decodificar o token
  jwt.verify(token, 'seu-segredo-jwt', (err, decoded) => {
    if (err) {
      return res.status(401).send('Token inválido.');
    }

    // Se o token for válido, armazenar as informações do usuário no request
    req.userId = decoded.id;
    next();
  });
};

module.exports = verificarToken;
