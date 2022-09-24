import express                from "express";
import { createServer }       from "http";
import { Server }             from "socket.io";
import dotenv                 from "dotenv";
import { AppDataSource }      from "data-source";
import { InitializeDatabase } from "config/InitializeDatabase";
import cors                   from "cors";
import { WebSockets }         from "routes/WebSockets";

const homeRoute         = require("./routes/home");
const registerRoute     = require("./routes/register");
const loginRoute        = require("./routes/login");
const refreshTokenRoute = require("./routes/refreshToken");
const userRoute         = require("./routes/user");

dotenv.config();

const app        = express();
const httpServer = createServer(app);
const io         = new Server(httpServer, {cors: {origin: "*"}});
const port       = process.env.PORT;
const websockets = new WebSockets();

const initializeDatabase = async () => {
    await AppDataSource.initialize();
    await new InitializeDatabase(false);
};

initializeDatabase()
    .then(() => console.log(`Database initialized with success`));

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

io.on("connection", websockets.onNewConnection);

app.use("/", homeRoute);
app.use("/api", registerRoute);
app.use("/api", loginRoute);
app.use("/api", refreshTokenRoute);
app.use("/api", userRoute);

httpServer.listen(port, () => console.log(`Server running on http://localhost:${port}`));

