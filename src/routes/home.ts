import express, { Request, Response } from "express";
import { Middlewares }                from "middlewares/Middlewares";

const route      = express();
const middleware = new Middlewares();

route.get("/", middleware.authorize, (req: Request, res: Response) => {
    res.status(200).json({message: "hello from homepageEEEE !"});
});

module.exports = route;
