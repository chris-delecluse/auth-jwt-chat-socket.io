import { CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Entities {
    @PrimaryGeneratedColumn()
    id!: number;

    @CreateDateColumn()
    createAt!: Date;

    @UpdateDateColumn()
    updateAt!: Date;
}
