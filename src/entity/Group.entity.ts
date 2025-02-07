import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Participant } from "./Participant.entity";
import { CommonEntity } from "./Common.entity";
import { Expense } from "./Expense.entity";
import { Settlement } from "./Settlement.entity";

@Entity()
export class Group extends CommonEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    name: string

    @OneToMany(() => Participant, (participant) => participant.group)
    participants: Participant[];

    @OneToMany(() => Expense, (expense) => expense.group)
    expenses: Expense[];

    @OneToMany(() => Settlement, (settlement) => settlement.group)
    settlements: Settlement[];
}
