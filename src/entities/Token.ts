import { Entities }                             from "entities/Entities";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Users }                                from "entities/Users";

@Entity()
export class Token extends Entities {
    constructor(token: string, expireIn: Date, user: Users) {
        super();

        this.token    = token;
        this.expireIn = expireIn;
        this.user     = user;
    }

    @Column()
    token: string;

    @Column()
    expireIn!: Date;

    @OneToOne(() => Users, (token) => token.id)
    @JoinColumn()
    user: Users;
}