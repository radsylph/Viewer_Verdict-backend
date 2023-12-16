"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const mediaRoutes_1 = __importDefault(require("./routes/mediaRoutes"));
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
dotenv_1.default.config({ path: ".env" });
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(express_1.default.static("public"));
app.use("/auth", userRoutes_1.default);
app.use("/media", mediaRoutes_1.default);
app.use("/chat", chatRoutes_1.default);
app.set("view engine", "pug");
app.set("views", "./views");
app.use(express_1.default.static("public"));
try {
    db_1.default.on("error", (err) => {
        console.error("Error de conexión a la base de datos:", err);
    });
    db_1.default.once("open", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("La conexión a la base de datos se ha establecido");
    }));
}
catch (error) {
    console.log(error);
}
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
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
httpServer.listen(port, () => console.log(`Example app listening on url ${port}!`));
