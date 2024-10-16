const { Server } = require("socket.io");

class SocketIO {
  io = null;

  init(server) {
    this.io = new Server(server, {
      cors: {
        origin: "*", // Configuração de CORS, ajuste conforme necessário
      },
    });

    this.io.on("connection", (socket) => {
      console.log(socket.id);
      console.log("A user connected");

      socket.on("disconnect", () => {
        console.log("A user disconnected");
      });
    });
  }
}

export default new SocketIO();
