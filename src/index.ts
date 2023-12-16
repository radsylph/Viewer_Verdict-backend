import express from "express";
import dotenv from "dotenv";
import db from "./config/db";
import userRouter from "./routes/userRoutes";
import mediaRouter from "./routes/mediaRoutes";
import chatRouter from "./routes/chatRoutes";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config({ path: ".env" });

const app = express();
const port = process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

app.use("/auth", userRouter);
app.use("/media", mediaRouter);
app.use("/chat", chatRouter);

app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.static("public"));

try {
  db.on("error", (err) => {
    console.error("Error de conexión a la base de datos:", err);
  });

  db.once("open", async () => {
    console.log("La conexión a la base de datos se ha establecido");
  });
} catch (error) {
  console.log(error);
}

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  transports: ["websocket", "polling"],
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("joinRoom", (data) => {
    socket.join(data.roomId);
    console.log("user joined room", data.roomId, data);
  });

  socket.on("leaveRoom", (data) => {
    socket.leave(data.roomId);
    console.log("user left room", data.roomId);
  });

  socket.on("chatMessage", (message) => {
    console.log(message);

    io.to(message.idRoom).emit("messageFromAnother", message);
  });

  socket.on("getMessages", (data) => {
    console.log(data);
    const msg = "bienvenido" + data.user.username;
    socket.emit("message", msg);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("privateMessage", (data) => {
    socket.to(data.to).emit("privateMessage", {
      from: socket.id,
      message: data.message,
    });
  });
});

httpServer.listen(port, () =>
  console.log(`Example app listening on url ${port}!`)
);
