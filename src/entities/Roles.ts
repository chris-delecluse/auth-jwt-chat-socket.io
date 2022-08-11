import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Permissions }                                                                        from "entities/Permissions";
import { Entities }                                                    from "entities/Entities";
import { Users }                                                       from "entities/Users";

@Entity()
export class Roles extends Entities {
    constructor(role: string) {
        super();

        this.role = role;
    }

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({unique: true})
    role!: string;

    @OneToMany(() => Permissions, permission => permission.role)
    permission!: Permissions[];

    @OneToMany(() => Users, users => users.role)
    @JoinColumn()
    users!: Users;
}