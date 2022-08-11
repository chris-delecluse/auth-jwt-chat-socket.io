import { Roles }         from "entities/Roles";
import { AppDataSource } from "data-source";
import { Permissions }   from "entities/Permissions";

export class InitializeDatabase {
    roles: Roles[]             = [
        new Roles("admin"),
        new Roles("member")
    ];
    permissions: Permissions[] = [
        new Permissions("read, create, update, delete", this.roles[0]),
        new Permissions("read, create, update", this.roles[1])
    ];

    constructor(dev: boolean) {
        if (dev) {
            this.insertData();
        }
    }

    private insertData = async (): Promise<void> => {
        await this.initRole();
        await this.initPermission();
    };

    private initRole = async (): Promise<void> => {
        const roles = await AppDataSource.getRepository(Roles);

        await roles.insert(this.roles);
    };

    private initPermission = async (): Promise<void> => {
        const permissions = await AppDataSource.getRepository(Permissions);

        await permissions.insert(this.permissions);
    };
}