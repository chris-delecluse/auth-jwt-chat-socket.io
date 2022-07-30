import { Column, Entity } from "typeorm";
import { Entities }       from "entities/Entities";

@Entity()
export class Users extends Entities {
    constructor(firstname: string, lastname: string, email: string, password: string) {
        super();

        this.firstname = firstname;
        this.lastname  = lastname;
        this.email     = email;
        this.password  = password;
    }

    @Column({
        type: "varchar",
        length: 512,
    })
    firstname: string;

    @Column({
        type: "varchar",
        length: 512,
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
}
