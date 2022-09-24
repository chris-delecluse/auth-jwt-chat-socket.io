import { MessageController } from "controllers/MessageController";

export class WebSockets {
    private onlineClients: Set<unknown>;
    private messageController: MessageController;

    constructor() {
        this.onlineClients     = new Set();
        this.messageController = new MessageController();
    }

    onNewConnection = (socket: any) => {
        console.info(`Socket ${socket.id} has connected.`);
        this.onlineClients.add(socket.id);

        socket.on("disconnect", () => {
            this.onlineClients.delete(socket.id);
            console.info(`Socket ${socket.id} has disconnected.`);
            console.log(this.onlineClients.size);
        });

        socket.on("message.post", async (message: any) => {
            if (message) await this.messageController.addMessageInDatabaseUsingWebSocket(message);

            socket.emit("message.get", message);
            // fait proc un message qui vas fetch en front
        });
    };
}
