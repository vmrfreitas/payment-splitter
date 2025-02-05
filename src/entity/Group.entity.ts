import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany, PrimaryColumn } from "typeorm";
import { User } from "./User.entity";
import { Participant } from "./Participant.entity";
import { CommonEntity } from "./Common.entity";

@Entity()
export class Group extends CommonEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    name: string

    @OneToMany(() => Participant, (participant) => participant.group, {
        cascade: ["soft-remove"]
    })
    participants: Participant[];

}
