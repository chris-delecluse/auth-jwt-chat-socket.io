import { JwtPayload, Secret, sign, SignOptions } from "jsonwebtoken";
import path                                      from "path";
import * as fs                                   from "fs";
import { Users }                                 from "entities/Users";

export class TokenUtils {
    generateJwt = (user: Users, expireIn: string): string => {
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

    addOneYearToADate = (): Date => {
        const date: Date         = new Date();
        const addOneYear: number = date.setFullYear(date.getFullYear() + 1);

        return new Date(addOneYear);
    };
}
