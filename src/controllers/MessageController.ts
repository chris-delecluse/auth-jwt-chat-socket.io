import { Request, Response } from "express";
import { MessageService }    from "services/MessageService";
import { UserService }       from "services/UserService";
import { Users }             from "entities/Users";
import { Messages }          from "entities/Messages";

export class MessageController {
    private messageService: MessageService;
    private userService: UserService;

    constructor() {
        this.messageService = new MessageService();
        this.userService    = new UserService();
    }

    addMessageInDatabaseUsingWebSocket = async (socketMessage: any) => {
        const {message, userId, toUserId} = socketMessage;
        const user: Users | null          = await this.userService.getOneById(userId);

        if (user) await this.messageService.insertOne(message, user, toUserId);
    };

    getUserMessage = async (req: Request, res: Response) => {
        const {id} = req.params;

        const user: Users      = await this.userService.getOneById(id) as Users;
        const result: Messages = user.message;

        return res
            .status(200)
            .json(result);
    };
}
