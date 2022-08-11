import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Entities }                             from "entities/Entities";
import { Users }          from "entities/Users";

@Entity()
export class Tokens extends Entities {
    constructor(token: string, expireIn: Date, user: Users) {
        super();

        this.token    = token;
        this.expireIn = expireIn;
        this.user   = user;
    }

    @Column()
    token: string;

    @Column()
    expireIn: Date;

    @OneToOne(() => Users, user => user.token)
    @JoinColumn()
    user: Users;
}