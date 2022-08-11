import { Repository }    from "typeorm";
import { Roles }         from "entities/Roles";
import { AppDataSource } from "data-source";
import { throwError }    from "exceptions/error";

export class RoleService {
    private repository: Repository<Roles>;

    constructor() {
        this.repository = AppDataSource.getRepository(Roles);
    }

    getOneById = async (roleId: number): Promise<Roles> => {
        return await this.repository.findOneBy({id: roleId})
               ?? throwError("Error: role do not exist.")
    };
}