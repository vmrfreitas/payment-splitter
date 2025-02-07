import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User.entity"
import { Group } from "./entity/Group.entity"
import { Participant } from "./entity/Participant.entity"
import { Expense } from "./entity/Expense.entity"
import { Settlement } from "./entity/Settlement.entity"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "paysplit",
    password: "securepassword",
    database: "postgres",
    synchronize: true,
    logging: false,
    entities: [User, Group, Participant, Expense, Settlement],
    migrations: [],
    subscribers: [],
})
