import express                from "express";
import dotenv                 from "dotenv";
import { AppDataSource }      from "data-source";
import { InitializeDatabase } from "config/InitializeDatabase";
import cors                   from "cors";
import { Server }             from "socket.io";
import { createServer }       from "http";

const homeRoute         = require("./routes/home");
const registerRoute     = require("./routes/register");
const loginRoute        = require("./routes/login");
const refreshTokenRoute = require("./routes/refreshToken");
const messageRoute      = require("./routes/message");

dotenv.config();

const app  = express();
const port = process.env.PORT;

const httpServer = createServer(app);
const io         = new Server(httpServer, {});

io.on("connection", (socket) => {
    console.log(socket.id);

    io.on("disconnected", (socket) => {
        console.log("user disconnected");
    });
});

const initializeDatabase = async () => {
    await AppDataSource.initialize();
    await new InitializeDatabase(false);
};

initializeDatabase()
    .then(() => console.log(`Database initialized with success`));

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

app.use("/", homeRoute);
app.use("/api", registerRoute);
app.use("/api", loginRoute);
app.use("/api", refreshTokenRoute);
app.use("/api", messageRoute);

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
