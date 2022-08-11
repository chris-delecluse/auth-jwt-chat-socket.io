import express             from "express";
import { UserService }     from "services/UserService";
import { TokenService }    from "services/TokenService";
import { TokenController } from "controllers/TokenController";
import { Middlewares }     from "middlewares/Middlewares";

const route = express();
const middleware = new Middlewares()

const userService     = new UserService();
const tokenService    = new TokenService();
const tokenController = new TokenController(userService, tokenService);

route.post("/refreshToken", middleware.authorize, async (req, res) => {
    await tokenController.refreshToken(req, res);
});

module.exports = route;