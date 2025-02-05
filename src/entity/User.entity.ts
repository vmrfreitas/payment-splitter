import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Participant } from "./Participant.entity";

@Entity()
export class User {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    name: string

    @OneToMany(() => Participant, (participant) => participant.user)
    participants: Participant[];
}
