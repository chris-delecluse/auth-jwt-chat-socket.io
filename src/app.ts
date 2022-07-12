import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { AppDataSource } from "data-source";
import { CustomMiddleware } from "middlewares/CustomMiddleware";

dotenv.config();

const app  = express();
const port = process.env.PORT;

const registerRoute = require("./routes/register");
const loginRoute    = require("./routes/login");

const middleware    = new CustomMiddleware();

AppDataSource.initialize()
    .then(() => console.log(`Database initialized with success`));

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get("/", middleware.auth, (req: Request, res: Response) => {
    res.send("welcome to home page !");
});

app.use("/api", registerRoute);
app.use("/api", loginRoute);

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
