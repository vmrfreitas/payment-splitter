import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Group } from "../entity/Group.entity";

export class GroupRepository {
    private repository: Repository<Group>;

    constructor() {
        this.repository = AppDataSource.getRepository(Group);
    }

    async findAllWithParticipants(): Promise<Group[] | null> {
        return await this.repository.find({ relations: ["participants"] });
    }

    async findById(id: string): Promise<Group | null> {
        return  await this.repository.findOneBy({ id });
    }
    
    async findByIdWithParticipantsAndExpensesAndSettlements(id: string): Promise<Group | null> {
        return await this.repository.findOne({ relations: ["participants", "expenses", "settlements"], where: { id } });
    }

    async findByIdWithExpensesAndParticipants(id: string): Promise<Group | null> { 
        return await this.repository.findOne({ relations: ["expenses", "participants"], where: { id } });
    }

    async findByIdWithParticipants(id: string): Promise<Group | null> {
        return await this.repository.findOne({ relations: ["participants"], where: { id } })
    }
    
    async findByIdWithExpenses(id: string): Promise<Group | null> { 
        return await this.repository.findOne({ relations: ["expenses"], where: { id } });
    }

    async saveSingle(goup: Group): Promise<Group> {
        return await this.repository.save(goup);
    }

    async removeSingle(goup: Group): Promise<Group> {
        return await this.repository.remove(goup);
    }
}
