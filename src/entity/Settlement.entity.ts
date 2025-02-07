import { Entity, ManyToOne, Column, PrimaryGeneratedColumn } from "typeorm";
import { Participant } from "./Participant.entity";
import { CommonEntity } from "./Common.entity";
import { Group } from "./Group.entity";

@Entity()
export class Settlement extends CommonEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ type: "decimal", precision: 10, scale: 2 })
    amount: number;

    @ManyToOne(() => Participant, (participant) => participant.settlementsPaid)
    payer: Participant;

    @ManyToOne(() => Participant, (participant) => participant.settlementsReceived)
    payee: Participant;

    @ManyToOne(() => Group, (group) => group.settlements)
    group: Group;
}