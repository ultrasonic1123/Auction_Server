const express = require("express");
const dotevn = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const router = require("./routes");
const app = express();
const httpServer = require("http").createServer(app);
const { Server } = require("socket.io");
dotevn.config();
const PORT = process.env.PORT ?? 5000;
const DB_URI = process.env.DB_URI;
const { handleOnBid } = require("./socket");
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", router);

mongoose
  .connect(DB_URI)
  .then(() => {
    console.log("connected to Database!");
    httpServer.listen(PORT, () => {
      console.log(`App is running on port: ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
let rooms = {};
let chatMessages = [];
io.on("connection", (socket) => {
  socket.on("join", () => {});
  socket.on("bid", (data) => {
    rooms = handleOnBid(socket, rooms, data, io);
  });
  socket.on("chat message", (data) => {
    chatMessages.push(data);
  });
});
