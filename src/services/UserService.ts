import { Users } from "entities/Users";
import { InsertResult, Repository } from "typeorm";
import { AppDataSource } from "data-source";

export class UserService {
    repository: Repository<Users>;

    constructor() {
        this.repository = AppDataSource.getRepository(Users);
    }

    async getOneByEmail(email: string): Promise<Users | null> {
        return await this.repository.findOneBy({email: email});
    }

    async insertOne(username: string, email: string, password: string): Promise<InsertResult> {
        return await AppDataSource
            .createQueryBuilder()
            .insert()
            .into(Users)
            .values({
                name: username,
                email: email,
                password: password
            })
            .execute();
    }
}
