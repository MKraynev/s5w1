import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserControllerRegistrationEntity } from "../../users/controllers/entities/users.controller.registration.entity";
import bcrypt from "bcrypt"

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

    @Column({ nullable: true })
    refreshPasswordTime: Date | null;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;

    public static async Init(inputUser: UserControllerRegistrationEntity, confirmEmail: boolean = false): Promise<UserRepoEntity> {
        let user: UserRepoEntity = new UserRepoEntity();
        user.login = inputUser.login;
        user.email = inputUser.email;
        user.salt = (await bcrypt.genSalt()).toString();
        user.hash = await bcrypt.hash(inputUser.password, user.salt);
        user.emailConfirmed = confirmEmail;

        return user;
    }
}