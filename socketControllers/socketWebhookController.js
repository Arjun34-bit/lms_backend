const socketIo = require("socket.io");

exports.socketWebhookController = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "Authorization"],
    },
  });

  io.on("connection", (socket) => {
    socket.emit("me", socket.id);

    socket.on("disconnect", () => {
      socket.broadcast.emit("callEnded");
    });

    socket.on("callUser", (data) => {
      console.log(`Incoming call from ${data.from}`);
      io.to(data.userToCall).emit("callUser", {
        signal: data.signalData,
        from: data.from,
        name: data.name,
      });
    });

    socket.on("answerCall", (data) => {
      console.log(`Answering call from ${data.from}`);
      io.to(data.to).emit("callAccepted", data.signal);
    });
  });
};
