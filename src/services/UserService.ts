import { Users } from "entities/Users";
import { InsertResult, Repository } from "typeorm";
import { AppDataSource } from "data-source";

export class UserService {
    repository: Repository<Users>;

    constructor() {
        this.repository = AppDataSource.getRepository(Users);
    }

    getOneByEmail = async (email: string): Promise<Users | null> => {
        return await this.repository.findOneBy({email: email});
    };

    insertOne = async (firstname: string, lastname: string, email: string, password: string): Promise<InsertResult> => {
        return await AppDataSource
            .createQueryBuilder()
            .insert()
            .into(Users)
            .values({
                firstname: firstname,
                lastname: lastname,
                email: email,
                password: password
            })
            .execute();
    };
}
