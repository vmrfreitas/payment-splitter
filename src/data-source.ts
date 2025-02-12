import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User.entity"
import { Group } from "./entity/Group.entity"
import { Participant } from "./entity/Participant.entity"
import { Expense } from "./entity/Expense.entity"
import { Settlement } from "./entity/Settlement.entity"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432", 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true,
    logging: false,
    entities: [User, Group, Participant, Expense, Settlement],
    migrations: [],
    subscribers: [],
})
