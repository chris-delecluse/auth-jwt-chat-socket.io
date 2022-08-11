import { Column, Entity, ManyToOne, OneToOne } from "typeorm";
import { Entities }                            from "entities/Entities";
import { Roles }                               from "entities/Roles";
import { Tokens }                              from "entities/Tokens";

@Entity()
export class Users extends Entities {
    constructor(firstname: string, lastname: string, email: string, password: string, role: Roles) {
        super();

        this.firstname = firstname;
        this.lastname  = lastname;
        this.email     = email;
        this.password  = password;
        this.role      = role;
    }

    @Column({
        type: "varchar",
        length: 512,
        unique: true
    })
    firstname: string;

    @Column({
        type: "varchar",
        length: 512,
        unique: true
    })
    lastname: string;

    @Column({
        type: "varchar",
        length: 512,
        unique: true
    })
    email: string;

    @Column({
        type: "varchar",
        length: 1000
    })
    password: string;

    @ManyToOne(() => Roles, roles => roles.users)
    role: Roles;

    @OneToOne(() => Tokens, token => token.user)
    token!: Tokens;
}
