import { JwtPayload, Secret, sign, SignOptions } from "jsonwebtoken";
import path from "path";
import * as fs from "fs";

export class Token {
    generateAccessToken = (userId: number, name: string) => {
        const payload: JwtPayload = {
            userId: userId,
            name: name
        };

        const privateKey: Secret = fs.readFileSync(path.join(__dirname, "./../../private.pem"));

        const signInOptions: SignOptions = {
            algorithm: "RS256",
            expiresIn: "1h"
        };

        return sign(payload, privateKey, signInOptions);
    };
}
