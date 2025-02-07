import { AppDataSource } from "../data-source";
import { Settlement } from "../entity/Settlement.entity";

export const SettlementRepository = AppDataSource.getRepository(Settlement);