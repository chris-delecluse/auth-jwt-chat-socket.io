import { Column, Entity, ManyToOne } from "typeorm";
import { Users } from "entities/Users";
import { Entities } from "entities/Entities";

@Entity()
export class UserMessages extends Entities {
    constructor(user: Users, message: string) {
        super();

        this.user    = user;
        this.message = message;
    }

    @Column({type: "text"})
    message: string;

    @ManyToOne(() => Users, u => u.id)
    user: Users;
}
