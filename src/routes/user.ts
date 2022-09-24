import express, { Request, Response } from "express";
import { Middlewares }                from "middlewares/Middlewares";
import { UserController }             from "controllers/UserController";
import { UserService }                from "services/UserService";
import { MessageService }             from "services/MessageService";
import { MessageController }          from "controllers/MessageController";

const route      = express();
const middleware = new Middlewares();

const userService       = new UserService();
const messageService    = new MessageService();
const messageController = new MessageController();
const userController    = new UserController(userService, messageService);

route.get("/user/:id", middleware.authorize, async (req: Request, res: Response) => {
    await userController.getUserSoftInformation(req, res);
});

route.get("/user/:id/messages", middleware.authorize, async (req: Request, res: Response) => {
    await messageController.getUserMessage(req, res);
});

module.exports = route;
