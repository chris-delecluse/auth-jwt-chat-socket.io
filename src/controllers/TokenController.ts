import { UserService }       from "services/UserService";
import { TokenService }      from "services/TokenService";
import { Request, Response } from "express";
import { verify }            from "jsonwebtoken";
import path                  from "path";
import fs                    from "fs";
import { IToken }            from "controllers/IToken";
import { TokenUtils }        from "utils/TokenUtils";
import { Users }             from "entities/Users";
import { throwError }        from "exceptions/error";

export class TokenController {
    userService: UserService;
    tokenService: TokenService;

    constructor(userService: UserService, tokenService: TokenService) {
        this.userService  = userService;
        this.tokenService = tokenService;
    }

    refreshToken = async (req: Request, res: Response): Promise<Response> => {
        const authHeader = req.headers["authorization"];
        const token      = authHeader && authHeader.split(" ")[1];

        if (token == null) return res.status(401).json({message: "error: token not provided"});

        const publicKey: Buffer = fs.readFileSync(path.join(__dirname, "../../public.pem"));

        const verifiedToken: IToken = verify(token, publicKey) as IToken;

        let user: Users | null = await this.userService.getOneById(verifiedToken.id);

        if (!user) return res.status(404).json({message: "error user do not have access"});

        if (!user.token) {
            await this.addOrUpdateTokenInDatabase(user, "add");
        } else if (this.tokenIsExpired(user.token.expireIn)) {
            await this.addOrUpdateTokenInDatabase(user, "update");
        }

        user = await this.userService.getOneById(verifiedToken.id);

        return res
            .status(200)
            .json({
                expireIn: user?.token.expireIn,
                refreshToken: user?.token.token
            });
    };

    private addOrUpdateTokenInDatabase = async (user: Users, method: string): Promise<void> => {
        const tokenUtils: TokenUtils     = new TokenUtils();
        const refreshToken: string       = tokenUtils.generateJwt(user, "365d");
        const refreshTokenExpireIn: Date = tokenUtils.addOneYearToADate();

        switch (method) {
            case "add":
                await this.tokenService.insertOne(refreshToken, refreshTokenExpireIn, user);
                break;
            case "update":
                await this.tokenService.update(user.token.id, refreshToken, refreshTokenExpireIn);
                break;
            default:
                throwError(`error: use "add" or "update" params`);
        }
    };

    private tokenIsExpired = (tokenDate: Date): boolean => {
        const currentDate: Date = new Date();

        return (tokenDate < currentDate);
    };
}
