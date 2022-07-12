import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Users } from "entities/Users";
import { UserMessages } from "entities/UserMessages";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || ""),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: true,
    entities: [
        Users,
        UserMessages
    ],
    subscribers: [],
    migrations: []
});