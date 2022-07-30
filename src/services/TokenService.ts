import { InsertResult, Repository } from "typeorm";
import { Token } from "entities/Token";
import { AppDataSource } from "data-source";

export class TokenService {
    repository: Repository<Token>;

    constructor() {
        this.repository = AppDataSource.getRepository(Token);
    }

    insertRefreshToken = async (token: string, expireIn: Date): Promise<InsertResult> => {
        return await this.repository
            .createQueryBuilder()
            .insert()
            .into(Token)
            .values({
                token: token,
                expireIn: expireIn
            })
            .execute();
    };
}