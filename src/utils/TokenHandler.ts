import { JwtPayload, Secret, sign, SignOptions } from "jsonwebtoken";
import path from "path";
import * as fs from "fs";

export class TokenHandler {
    genAccessToken = (userId: number, firstname: string, lastname: string): string => {
        const payload: JwtPayload = {
            userId: userId,
            firstname: firstname,
            lastname: lastname
        };

        const privateKey: Secret = fs.readFileSync(path.join(__dirname, "../../private.pem"));

        const signOptions: SignOptions = {
            algorithm: "RS256",
            expiresIn: "1800s"
        };

        return sign(payload, privateKey, signOptions);
    };

    genRefreshToken = async () => {

    };
}
