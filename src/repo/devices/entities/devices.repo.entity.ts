//TODO доделать one->many   many->one

import { UserRepoEntity } from "src/repo/users/entities/users.repo.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RequestDeviceEntity } from "../../../common/decorators/requestedDeviceInfo/entity/request.device.entity";
import { UsersRepoService } from "src/repo/users/users.repo.service";

@Entity('Devices')
export class DeviceRepoEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    ip: string;

    // @ManyToOne(() => UserRepoEntity)
    // user: UserRepoEntity;
    @ManyToOne(() => UserRepoEntity, (user) => user.devices, { nullable: false, onDelete: "CASCADE" })
    @JoinColumn()
    user: UserRepoEntity;
    @Column()
    userId: number;

    @Column({ nullable: true })
    refreshTime: Date;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;

    public static Init(inputDeviceData: RequestDeviceEntity): DeviceRepoEntity {
        let device = new DeviceRepoEntity();

        device.name = inputDeviceData.name;
        device.ip = inputDeviceData.ip;

        device.UpdateRefreshTime();

        return device;
    }

    public UpdateRefreshTime() {
        this.refreshTime = new Date();
    }
}