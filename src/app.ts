import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { AppDataSource } from "data-source";
import { CustomMiddleware } from "middlewares/CustomMiddleware";
import cors from "cors";

dotenv.config();

const app  = express();
const port = process.env.PORT;

const registerRoute = require("./routes/register");
const loginRoute    = require("./routes/login");

const middleware = new CustomMiddleware();

AppDataSource.initialize()
    .then(() => console.log(`Database initialized with success`));

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

app.get("/", middleware.auth, async (req: Request, res: Response) => {
    await res.status(200).json({message: "hello from homepage !"});
});

app.use("/api", registerRoute);
app.use("/api", loginRoute);

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
