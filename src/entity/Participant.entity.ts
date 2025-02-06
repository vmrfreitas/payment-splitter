// entities/Participant.entity.ts
import { Entity, PrimaryColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User.entity";
import { Group } from "./Group.entity";

@Entity()
export class Participant {
  @PrimaryColumn()
  userId: string;

  @PrimaryColumn()
  groupId: string;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  balance: number;

  @ManyToOne(() => User, (user) => user.participants)
  user: User;

  @ManyToOne(() => Group, (group) => group.participants)
  group: Group;
}