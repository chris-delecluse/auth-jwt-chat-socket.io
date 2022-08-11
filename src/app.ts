import express, { Request, Response } from "express";
import dotenv                         from "dotenv";
import { AppDataSource }              from "data-source";
import { Middlewares }                from "middlewares/Middlewares";
import cors                           from "cors";
import { InitializeDatabase }         from "config/InitializeDatabase";

dotenv.config();

const app  = express();
const port = process.env.PORT;

const registerRoute     = require("./routes/register");
const loginRoute        = require("./routes/login");
const refreshTokenRoute = require("./routes/refreshToken");

const middleware: Middlewares = new Middlewares();

const initializeDatabase = async () => {
    await AppDataSource.initialize();
    await new InitializeDatabase(false);
};

initializeDatabase()
    .then(() => console.log(`Database initialized with success`));

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

app.get("/", middleware.authorize, (req: Request, res: Response) => {
    res.status(200).json({message: "hello from homepage !"});
});

app.use("/api", registerRoute);
app.use("/api", loginRoute);
app.use("/api", refreshTokenRoute);

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
