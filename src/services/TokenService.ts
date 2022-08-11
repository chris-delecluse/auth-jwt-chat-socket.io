import { InsertResult, Repository } from "typeorm";
import { Tokens }                   from "entities/Tokens";
import { AppDataSource }            from "data-source";
import { Users }                    from "entities/Users";

export class TokenService {
    private repository: Repository<Tokens>;

    constructor() {
        this.repository = AppDataSource.getRepository(Tokens);
    }

    insertOne = async (refreshToken: string, expireIn: Date, user: Users): Promise<InsertResult> => {
        return await this.repository.insert({
            expireIn: expireIn,
            token: refreshToken,
            user: user
        });
    };

    update = async (id: number, token: string, expireIn: Date) => {
        return await this.repository.update({id: id}, {
            token: token,
            expireIn: expireIn,
            updateAt: new Date()
        });
    };
}