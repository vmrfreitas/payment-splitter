import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { User } from "./User.entity";
import { Group } from "./Group.entity";
import { Expense } from "./Expense.entity";
import { Settlement } from "./Settlement.entity";

@Entity()
export class Participant {
  @PrimaryColumn("uuid")
  userId: string;

  @PrimaryColumn("uuid")
  groupId: string;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  balance: number;

  @OneToMany(() => Expense, (expense) => expense.payer)
  payments: Expense[];

  @ManyToOne(() => User, (user) => user.participants)
  user: User;

  @ManyToOne(() => Group, (group) => group.participants)
  group: Group;

  @OneToMany(() => Settlement, (settlement) => settlement.payer)
  settlementsPaid: Settlement[];

  @OneToMany(() => Settlement, (settlement) => settlement.payee)
  settlementsReceived: Settlement[];
}