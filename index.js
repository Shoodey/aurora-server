const app = require("express")();
const moment = require("moment");
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "https://example.com",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("joinChannel", ({ user, channel }) => {
    socket.join(channel.id);

    // Send to same client
    socket.emit("message", {
      author: "System",
      content: `Tervetuloa ${user.name}!`,
      created_at: moment().format(),
    });

    // Send to all other clients
    socket.broadcast.to(channel.id).emit("message", {
      author: "System",
      content: `${user.name} has joined!`,
      created_at: moment().format(),
    });
  });

  socket.on("userMessage", ({ user, channel, message }) => {
    io.to(channel.id).emit("message", {
      author: user.name,
      content: message,
      created_at: moment().format(),
    });
  });
});

server.listen(4000);
