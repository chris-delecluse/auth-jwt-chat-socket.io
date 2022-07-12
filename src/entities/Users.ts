import { Column, Entity } from "typeorm";
import { Entities } from "entities/Entities";

@Entity()
export class Users extends Entities {
    constructor(name: string, email: string, password: string) {
        super();

        this.name     = name;
        this.email    = email;
        this.password = password;
    }

    @Column({
        type: "varchar",
        length: 512,
        unique: true
    })
    name: string;

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
}
