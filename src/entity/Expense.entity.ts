import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne } from "typeorm";
import { Group } from "./Group.entity";
import { CommonEntity } from "./Common.entity";
import { Participant } from "./Participant.entity";

@Entity()
export class Expense extends CommonEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    description: string

    @Column({ type: "decimal", precision: 10, scale: 2 })
    amount: number

    @ManyToOne(() => Participant, (participant) => participant.payments)
    payer: Participant

    @ManyToOne(() => Group, (group) => group.expenses)
    group: Group;
    
    @ManyToMany(() => Participant)
    @JoinTable()
    payees: Participant[]
    
    calculationMetadata: {
        dividedAmount: number;
        remainder: number;
    }
}
