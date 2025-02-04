import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User.entity"
import { Group } from "./entity/Group.entity"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "paysplit",
    password: "securepassword",
    database: "postgres",
    synchronize: true,
    logging: false,
    entities: [User, Group],
    migrations: [],
    subscribers: [],
})
