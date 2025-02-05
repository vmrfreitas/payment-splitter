import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany, PrimaryColumn } from "typeorm";
import { User } from "./User.entity";
import { Participant } from "./Participant.entity";

@Entity()
export class Group {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    name: string

    @OneToMany(() => Participant, (participant) => participant.group)
    participants: Participant[];

}
