import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, JoinColumn, OneToOne, ManyToOne } from "typeorm";
import { User } from "./User.entity";
import { Group } from "./Group.entity";
import { CommonEntity } from "./Common.entity";
import { Participant } from "./Participant.entity";

@Entity()
export class Expense extends CommonEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    name: string

    @Column()
    amount: number

    @ManyToOne(() => Participant, (participant) => participant.payments)
    payer: Participant

    @ManyToOne(() => Group, (group) => group.expenses)
    group: Group;
    
    @ManyToMany(() => Participant)
    @JoinTable()
    payees: Participant[]
    
}
