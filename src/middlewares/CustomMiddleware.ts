import { NextFunction, Request, Response } from "express";
import { Secret, verify } from "jsonwebtoken";
import fs from "fs";
import path from "path";

export class CustomMiddleware {
    auth = async (req: Request, res: Response, next: NextFunction) => {
        if (req.headers.authorization) {
            const token: string = req.headers.authorization.split(" ")[1];

            const publicKey: Secret = fs.readFileSync(path.join(__dirname, "./../../public.pem"));

            verify(token, publicKey, function (err, decoded) {
                if (err) {
                    res.status(401).send("Unauthorized");
                } else {
                    console.log(decoded);
                    next();
                }
            });
        }
    };
}