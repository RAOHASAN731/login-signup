// server/server.js
const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const dotenv = require("dotenv");
const Message = require("./models/Message");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(express.json());
app.use("/api", authRoutes);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("sendMessage", async (data) => {
    const message = new Message(data);
    await message.save();
    io.emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(process.env.PORT || 5000, () => {
  console.log("Server is running");
});
