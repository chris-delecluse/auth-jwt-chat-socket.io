import { UserService }       from "services/UserService";
import { TokenService }      from "services/TokenService";
import { Request, Response } from "express";
import { IToken }            from "controllers/IToken";
import { TokenUtils }        from "utils/TokenUtils";
import { Users }             from "entities/Users";
import { throwError }        from "exceptions/error";

export class TokenController {
    private userService: UserService;
    private tokenService: TokenService;

    constructor(userService: UserService, tokenService: TokenService) {
        this.userService  = userService;
        this.tokenService = tokenService;
    }

    refreshToken = async (req: Request, res: Response): Promise<Response> => {
        const jwtUtils: TokenUtils  = new TokenUtils();
        const verifiedToken: IToken = await jwtUtils.decryptUserJwt(req, res) as IToken;

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
        const refreshToken: string       = tokenUtils.generateUserJwt(user, "365d");
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
