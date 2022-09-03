import express, { Request, Response } from "express";
import { Middlewares }                from "middlewares/Middlewares";
import { MessageController }          from "controllers/MessageController";

const route      = express();
const middleware = new Middlewares();

const messageController = new MessageController();

route.post("/message", middleware.authorize, async (req: Request, res: Response) => {

});

route.get("/message", middleware.authorize, async (req: Request, res: Response) => {
    await messageController.hello(res);
});

module.exports = route;
