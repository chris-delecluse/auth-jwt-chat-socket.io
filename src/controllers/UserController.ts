import { Request, Response } from "express";
import bcrypt                from "bcrypt";
import { randomBytes }       from "crypto";
import { UserService }       from "services/UserService";
import { TokenHandler }      from "utils/TokenHandler";
import { Users }             from "entities/Users";
import { TokenService }      from "services/TokenService";
import Cookies               from "cookies";

export class UserController {
    private userService: UserService;
    private tokenService: TokenService;

    constructor(userService: UserService, tokenService: TokenService) {
        this.userService  = userService;
        this.tokenService = tokenService;
    }

    getConnected = async (req: Request, res: Response) => {
        const token: TokenHandler = new TokenHandler();
        const myCookie            = new Cookies(req, res);

        try {
            const {email, password} = req.body;

            if (!email) {
                return res
                    .status(400)
                    .json({message: "missing required parameters", info: "email"});
            }

            if (!password) {
                return res
                    .status(400)
                    .json({message: "missing required parameters", info: "password"});
            }

            const user: Users | undefined = await this.authenticate(email, password);

            if (!user) {
                return res
                    .status(400)
                    .json({message: "Email or password is incorrect"});
            }

            const xsrfToken: string    = randomBytes(64).toString("hex");
            const accessToken: string  = token.genAccessToken(user.id, user.firstname, user.lastname);
            const refreshToken: string = randomBytes(128).toString("base64");

            const date           = new Date();
            const addOneYearDate = date.setFullYear(date.getFullYear() + 1);
            const expireIn: Date = new Date(addOneYearDate);

            await this.tokenService.insertRefreshToken(refreshToken, expireIn);

            myCookie.set("access_token", accessToken, {
                httpOnly: true,
                maxAge: 1800,
            });

            myCookie.set("refresh_token", refreshToken, {
                httpOnly: true,
                maxAge: 31556926,
            })

            res.json({
                accessTokenExpireIn: "1800s",
                refreshTokenExpireIn: expireIn,
                xsrfToken
            });

        } catch (err) {
            return res
                .status(500)
                .json({message: "Internal server error"});
        }
    };

    register = async (req: Request, res: Response): Promise<Response> => {
        const firstname = req.body.firstname;
        const lastname  = req.body.lastname;
        const password  = req.body.password;
        const email     = req.body.email;

        const regexEmail: RegExp    = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        const regexPassword: RegExp = /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{5,16}$/;
        const regexUsername: RegExp = /^[a-zA-Z]{3,20}$/;

        if (firstname == null || lastname == null || email == null || password == null) {
            return res
                .status(400)
                .json({"Error": "missing parameters"});
        }

        if (regexEmail.test(email) && regexPassword.test(password)
            && regexUsername.test(firstname) && regexUsername.test(lastname)) {
            return await this.storeUserInDatabaseIfNotExist(req, res, firstname, lastname, email, password);
        } else {
            return res
                .status(400)
                .json({"Error": "incorrect information"});
        }
    };

    private authenticate = async (email: string, password: string): Promise<Users | undefined> => {
        const user = await this.userService.getOneByEmail(email);

        if (user) {
            const validPassword: boolean = await bcrypt.compare(password, user.password);

            if (email === user.email && validPassword) {
                return user;
            }
        }
    };

    private storeUserInDatabaseIfNotExist = async (req: Request, res: Response, firstname: string, lastname: string, email: string, password: string): Promise<Response> => {
        const userFound = await this.userService.getOneByEmail(email);

        if (!userFound) {
            bcrypt.hash(password, 5, (err: Error | undefined, passwordHash: string) => {
                this.userService.insertOne(firstname, lastname, email, passwordHash);
            });

            return res
                .status(201)
                .json({"Success": "User created successfully"});

        } else {
            return res
                .status(409)
                .json({"Error": "User already exist"});
        }
    };
}
