import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Settlement } from "../entity/Settlement.entity";

export class SettlementRepository {
    private repository: Repository<Settlement>;

    constructor() {
        this.repository = AppDataSource.getRepository(Settlement);
    }

    async findOneByIdWithPayerAndPayee(id: string): Promise<Settlement | null>{ 
        return await this.repository.findOne({ relations:["payer", "payee"], where: { id } })
    }

    async findByGroupIdWithPayerAndPayees(groupId: string): Promise<Settlement[] | null> {
        return await this.repository.createQueryBuilder("settlement")
            .leftJoinAndSelect("settlement.payer", "payer")
            .leftJoinAndSelect("settlement.payee", "payee")
            .where("settlement.groupId = :groupId", { groupId })
            .getMany();
    }

    async save(settlement: Settlement): Promise<Settlement> {
        return await this.repository.save(settlement);
    }

    async removeSingle(settlement: Settlement): Promise<Settlement> {
        return await this.repository.remove(settlement);
    }

    async removeMany(settlements: Settlement[]): Promise<Settlement[]> {
        return await this.repository.remove(settlements);
    }
}