import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserCreateEntity } from "./users.create.entity";

@Entity("Users")
export class UserRepoEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    login: string;

    @Column()
    email: string;

    @Column()
    salt: string;

    @Column()
    hash: string;

    @Column()
    emailConfirmed: boolean;

    @Column({nullable: true})
    refreshPasswordTime: Date | null;

    @CreateDateColumn({type: 'timestamptz'})
    createdAt: Date;

    @UpdateDateColumn({type: 'timestamptz'})
    updatedAt: Date;
}