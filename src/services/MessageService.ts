import { Repository }    from "typeorm";
import { Messages }      from "entities/Messages";
import { AppDataSource } from "data-source";
import { Users }         from "entities/Users";

export class MessageService {
    private repository: Repository<Messages>;

    constructor() {
        this.repository = AppDataSource.getRepository(Messages);
    }

    getAllByMessageTo = async (to: number) => {
        return await this.repository.find({where: {toUserId: to}});
    };

    insertOne = async (message: string, from: Users, to: number) => {
        return await this.repository.insert({
            text: message,
            user: from,
            toUserId: to
        });
    };
}
