import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { UserService } from "services/UserService";
import { Token } from "utils/Token";

export class UserController {
    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    async authenticate(req: Request, res: Response) {
        const token: Token = new Token();

        const email    = req.body.email;
        const password = req.body.password;

        const userFound = await this.userService.getOneByEmail(email);

        if (userFound) {
            const validPassword = await bcrypt.compare(password, userFound.password);

            if (userFound.email == email && validPassword) {
                const finalToken = token.generateAccessToken(userFound.id, userFound.name);

                return res
                    .status(200)
                    .json({
                        "Success": "Connected !",
                        "Token": finalToken
                    });
            } else {
                return res
                    .status(400)
                    .json({"Error:": "incorrect information"});
            }

        } else {
            return res
                .status(204)
                .json({"Error": "user do not exist"});
        }
    }

    async register(req: Request, res: Response): Promise<Response> {
        const username = req.body.username;
        const password = req.body.password;
        const email    = req.body.email;

        const regexEmail: RegExp    = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        const regexPassword: RegExp = /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{5,16}$/;
        const regexUsername: RegExp = /^[a-zA-Z]{3,20}$/;

        if (username == null || email == null || password == null) {
            return res
                .status(400)
                .json({"Error": "missing parameters"});
        }

        if (regexEmail.test(email) && regexPassword.test(password) && regexUsername.test(username)) {
            return await this.insertUserIfNotExist(req, res, username, email, password);
        } else {
            return res
                .status(400)
                .json({"Error": "incorrect information"});
        }
    }

    private async insertUserIfNotExist(req: Request, res: Response, username: string, email: string, password: string): Promise<Response> {
        const userFound = await this.userService.getOneByEmail(email);

        if (!userFound) {
            bcrypt.hash(password, 5, (err: Error | undefined, passwordHash: string) => {
                this.userService.insertOne(username, email, passwordHash);
            });

            return res
                .status(201)
                .json({"Success": "user created successfully"});

        } else {
            return res
                .status(409)
                .json({"Error": "user already exist"});
        }
    }
}
