import express, { Request, Response } from "express";
import { UserController }             from "controllers/UserController";
import { UserService }                from "services/UserService";
import { TokenService }               from "services/TokenService";

const route = express();

const userService: UserService       = new UserService();
const tokenService: TokenService     = new TokenService();
const userController: UserController = new UserController(userService, tokenService);

route.post("/login", async (req: Request, res: Response) => {
    await userController.getConnected(req, res);
});

module.exports = route;
