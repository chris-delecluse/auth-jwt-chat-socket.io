import express, { Request, Response } from "express";
import { UserController } from "controllers/UserController";
import { UserService } from "services/UserService";

const route = express();

const userService    = new UserService();
const userController = new UserController(userService);

route.post("/login", async (req: Request, res: Response) => {
    await userController.authenticate(req, res);
});

module.exports = route;
