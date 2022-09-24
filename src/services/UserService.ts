import { Users }                    from "entities/Users";
import { InsertResult, Repository } from "typeorm";
import { AppDataSource }            from "data-source";
import { Roles }                    from "entities/Roles";

export class UserService {
    private repository: Repository<Users>;

    constructor() {
        this.repository = AppDataSource.getRepository(Users);
    }

    getOneByEmail = async (email: string): Promise<Users | null> => {
        return await this.repository.findOne({
            where: {email: email},
            relations: {
                role: true,
                token: true
            }
        });
    };

    getOneById = async (id: string): Promise<Users | null> => {
        return await this.repository.findOne({
            where: {id: id},
            relations: {
                role: true,
                token: true,
                message: true
            }
        });
    };

    insertOne = async (firstname: string, lastname: string, email: string, password: string, role: Roles): Promise<InsertResult> => {
        return await AppDataSource
            .createQueryBuilder()
            .insert()
            .into(Users)
            .values({
                firstname: firstname,
                lastname: lastname,
                email: email,
                password: password,
                role: role
            })
            .execute();
    };
}
