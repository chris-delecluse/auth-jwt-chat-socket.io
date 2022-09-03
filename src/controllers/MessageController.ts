import { Response }       from "express";
import { MessageService } from "services/MessageService";

export class MessageController {
    private messageService: MessageService;

    constructor() {
        this.messageService = new MessageService();
    }

    hello = (res: Response) => {
        return res.status(200).json({message: "hello from message"});
    };
}
