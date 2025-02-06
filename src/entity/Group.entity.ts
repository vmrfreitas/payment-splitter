import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Participant } from "./Participant.entity";
import { CommonEntity } from "./Common.entity";

@Entity()
export class Group extends CommonEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    name: string

    @OneToMany(() => Participant, (participant) => participant.group)
    participants: Participant[];

}
