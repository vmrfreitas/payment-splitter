import { AppDataSource } from "../data-source";
import { User } from "../entity/User.entity";

export const UserRepository = AppDataSource.getRepository(User);