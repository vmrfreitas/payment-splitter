import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, JoinColumn, OneToOne } from "typeorm";
import { User } from "./User.entity";
import { Group } from "./Group.entity";

@Entity()
export class Expense {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    name: string

    @Column()
    amount: number

    @OneToOne(() => User)
    @JoinColumn()
    payer: User

    @OneToOne(() => Group)
    @JoinColumn()
    group: Group
    
    @ManyToMany(() => User)
    @JoinTable()
    participants: User[]
    
}
