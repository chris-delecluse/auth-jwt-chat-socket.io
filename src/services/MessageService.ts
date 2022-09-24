import { Repository }    from "typeorm";
import { Messages }      from "entities/Messages";
import { AppDataSource } from "data-source";
import { Users }         from "entities/Users";

export class MessageService {
    private repository: Repository<Messages>;

    constructor() {
        this.repository = AppDataSource.getRepository(Messages);
    }

    insertOne = async (message: string, userFrom: Users, to: string) => {
        return await this.repository.insert({
            text: message,
            user: userFrom,
            toUserId: to
        });
    };
}
