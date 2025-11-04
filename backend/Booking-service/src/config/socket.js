
let io;

const { Server } = require("socket.io");

 function setup_socket(server){
     
     io = new Server(server, {
    cors: {
      origin: '*',
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);
    });
  });

  return io;

}


function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized yet!");
  }
  return io;
}

module.exports = { setup_socket, getIO };