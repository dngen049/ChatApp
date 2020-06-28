const express = require("express");
const http = require("http");
const socket = require("socket.io");

const app = express();
app.use("/", (req, res, next) => {
  res.send("Hello world");
});
const server = http.createServer(app);
const io = socket(server);

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.emit("Your id", socket.id);
  socket.on("send message", (body) => {
    io.emit("message", body);
  });
});

server.listen(8000, () => console.log("Server is runninf on port 8000"));
