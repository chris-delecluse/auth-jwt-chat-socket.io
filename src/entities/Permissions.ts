import { Column, Entity, ManyToOne } from "typeorm";
import { Roles }                     from "entities/Roles";
import { Entities }                  from "entities/Entities";

@Entity()
export class Permissions extends Entities {
    constructor(permission: string, role: Roles) {
        super();

        this.permission = permission;
        this.role       = role;
    }

    @Column({length: 200})
    permission!: string;

    @ManyToOne(() => Roles, roles => roles.permission)
    role!: Roles;
}
