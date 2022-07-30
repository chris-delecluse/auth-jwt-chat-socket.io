import express, { Request, Response } from "express";
import { UserController } from "controllers/UserController";
import { UserService } from "services/UserService";
import { TokenService } from "services/TokenService";

const route = express();

const userService    = new UserService();
const tokenService = new TokenService()
const userController = new UserController(userService, tokenService);

route.post("/register", async (req: Request, res: Response) => {
    await userController.register(req, res);
});

module.exports = route;
