import { JwtPayload, Secret, sign, SignOptions, verify } from "jsonwebtoken";
import path                                              from "path";
import * as fs                                           from "fs";
import { Users }                                         from "entities/Users";
import { Request, Response }                             from "express";
import { IToken }                                        from "controllers/IToken";

export class TokenUtils {
    generateUserJwt = (user: Users, expireIn: string): string => {
        const {id, firstname, lastname, role} = user;

        const payload: JwtPayload = {
            userid: id,
            userRole: role,
            firstname: firstname,
            lastname: lastname
        };

        const privateKey: Secret = fs.readFileSync(path.join(__dirname, "./../../private.pem"));

        const signOptions: SignOptions = {
            algorithm: "RS256",
            expiresIn: expireIn
        };

        return sign(payload, privateKey, signOptions);
    };

    decryptUserJwt = async (req: Request, res: Response): Promise<IToken | Response> => {
        const authHeader = req.headers.authorization;
        const token      = authHeader && authHeader.split(" ")[1];

        if (token == null) return res.status(401).json({message: "error: token not provided"});

        const publicKey: Buffer = fs.readFileSync(path.join(__dirname, "../../public.pem"));

        return verify(token, publicKey) as IToken;
    };

    addOneYearToADate = (): Date => {
        const date: Date         = new Date();
        const addOneYear: number = date.setFullYear(date.getFullYear() + 1);

        return new Date(addOneYear);
    };
}
