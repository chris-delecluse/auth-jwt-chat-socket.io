import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import { Roles }                                                                                  from "entities/Roles";
import {
    Tokens
}                                                                                                 from "entities/Tokens";

@Entity()
export class Users {
    constructor(firstname: string, lastname: string, email: string, password: string, role: Roles) {
        this.firstname = firstname;
        this.lastname  = lastname;
        this.email     = email;
        this.password  = password;
        this.role      = role;
    }

    // mixin pour extends (ts)
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @CreateDateColumn()
    createAt!: Date;

    @UpdateDateColumn()
    updateAt!: Date;

    @Column({
        type: "varchar",
        length: 256,
        unique: true
    })
    firstname: string;

    @Column({
        type: "varchar",
        length: 256,
        unique: true
    })
    lastname: string;

    @Column({
        type: "varchar",
        length: 256,
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
