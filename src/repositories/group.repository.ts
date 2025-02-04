import { AppDataSource } from "../data-source";
import { Group } from "../entity/Group.entity";

export const GroupRepository = AppDataSource.getRepository(Group);