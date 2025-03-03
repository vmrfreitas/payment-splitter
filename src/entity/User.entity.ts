import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Participant } from "./Participant.entity";
import { CommonEntity } from "./Common.entity";

@Entity()
export class User extends CommonEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    email: string

    @Column()
    name: string

    @OneToMany(() => Participant, (participant) => participant.user)
    participants: Participant[];
}
