import { Request, Response } from "express";
import bcrypt                from "bcrypt";
import { UserService }       from "services/UserService";
import { TokenUtils }        from "utils/TokenUtils";
import { TokenService }      from "services/TokenService";
import { RoleService }       from "services/RoleService";
import { Users }             from "entities/Users";
import { Roles }             from "entities/Roles";

export class AuthController {
    private userService: UserService;
    private tokenService: TokenService;
    private roleService: RoleService;

    constructor(userService: UserService, tokenService: TokenService, roleService: RoleService) {
        this.userService  = userService;
        this.tokenService = tokenService;
        this.roleService  = roleService;
    }

    getConnected = async (req: Request, res: Response): Promise<Response> => {
        const authUtils: TokenUtils = new TokenUtils();

        try {
            const {email, password} = req.body;

            if (!email) return this.missingParameterError(res);
            if (!password) return this.missingParameterError(res);

            const user: Users | undefined = await this.authenticate(email, password);

            if (!user) return res.status(400).json({message: "email or password is incorrect"});

            const accessToken: string = authUtils.generateJwt(user, "1800s");

            return res
                .status(200)
                .json({
                    accessTokenExpireIn: "1800s",
                    accessToken
                });
        } catch (error) {
            return res
                .status(500)
                .json({message: "internal server error"});
        }
    };

    private missingParameterError = (res: Response) => res.status(400).json({message: "missing required parameters"});

    private authenticate = async (email: string, password: string) => {
        const user: Users | null = await this.userService.getOneByEmail(email);

        if (user) {
            const validPassword: boolean = await bcrypt.compare(password, user.password);

            if (user.email === email && validPassword) {
                return user;
            }
        }
    };

    register = async (req: Request, res: Response): Promise<Response> => {
        const {firstname, lastname, email, password} = req.body;

        const regexEmail: RegExp    = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        const regexPassword: RegExp = /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{5,16}$/;
        const regexName: RegExp     = /^[a-zA-Z]{3,20}$/;

        if (firstname == null || lastname == null || email == null || password == null) this.missingParameterError(res);

        if (regexEmail.test(email) && regexPassword.test(password)
            && regexName.test(firstname) && regexName.test(lastname)) {

            return await this.storeUserInDatabaseIfNotExist(req, res, firstname, lastname, email, password);
        } else {
            return res
                .status(400)
                .json({"error": "incorrect information"});
        }
    };

    private storeUserInDatabaseIfNotExist = async (req: Request, res: Response, firstname: string, lastname: string, email: string, password: string): Promise<Response> => {
        const userFound: Users | null = await this.userService.getOneByEmail(email);

        if (!userFound) {
            const role: Roles = await this.roleService.getOneById(2);

            bcrypt.hash(password, 5, (err: Error | undefined, passwordHash: string) => {
                this.userService.insertOne(firstname, lastname, email, passwordHash, role);
            });

            return res
                .status(201)
                .json({"success": "user created successfully"});

        } else {
            return res
                .status(409)
                .json({"error": "user already exist"});
        }
    };
}
