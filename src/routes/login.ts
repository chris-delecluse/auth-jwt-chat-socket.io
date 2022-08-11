import express, { Request, Response } from "express";
import { AuthController }             from "controllers/AuthController";
import { UserService }                from "services/UserService";
import { TokenService }               from "services/TokenService";
import { RoleService }                from "services/RoleService";

const route = express();

const userService    = new UserService();
const tokenService   = new TokenService();
const roleService    = new RoleService();
const authController = new AuthController(userService, tokenService, roleService);

route.post("/login", async (req: Request, res: Response) => {
    await authController.getConnected(req, res);
});

module.exports = route;
