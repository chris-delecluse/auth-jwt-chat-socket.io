import express, { Request, Response } from "express";
import { Middlewares }                from "middlewares/Middlewares";
import { UserController }             from "controllers/UserController";
import { UserService }                from "services/UserService";

const route      = express();
const middleware = new Middlewares();

const userService    = new UserService();
const userController = new UserController(userService);

route.get("/user/:id", middleware.authorize, async (req: Request, res: Response) => {
    await userController.getUserSoftInformation(req, res);
});

export default route;
