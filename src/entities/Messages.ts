import { Entities }                  from "entities/Entities";
import { Column, Entity, ManyToOne } from "typeorm";
import { Users }                     from "entities/Users";

@Entity()
export class Messages extends Entities {
    constructor(text: string, user: Users, toUserId: string) {
        super();

        this.text     = text;
        this.user     = user;
        this.toUserId = toUserId;
    }

    @Column({length: 1000})
    text: string;

    @ManyToOne(() => Users, user => user)
    user: Users;

    @Column()
    toUserId: string;
}
