import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { User } from "./User.entity";

@Entity()
export class Group {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    name: string

    @ManyToMany(() => User)
    @JoinTable()
    users: User[]
    
}
