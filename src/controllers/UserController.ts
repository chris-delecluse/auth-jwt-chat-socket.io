import { UserService }       from "services/UserService";
import { Request, Response } from "express";
import { TokenUtils }        from "utils/TokenUtils";
import { IToken }            from "controllers/IToken";

export class UserController {
    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    getUserSoftInformation = async (req: Request, res: Response) => {
        const jwtUtils: TokenUtils  = new TokenUtils();
        const verifiedToken: IToken = await jwtUtils.decryptUserJwt(req, res) as IToken;

        const result = {
            id: verifiedToken.id,
            firstname: verifiedToken.firstname,
            lastname: verifiedToken.lastname
        };

        return res
            .status(200)
            .json(result);
    };
}
