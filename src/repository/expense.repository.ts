import { DataSource, Repository } from "typeorm";
import { Expense } from "../entity/Expense.entity";

export class ExpenseRepository {
    private repository: Repository<Expense>;

    constructor(private datasource: DataSource) {
        this.repository = datasource.getRepository(Expense);
    }

    async findByGroupIdWithPayerAndPayees(groupId: string): Promise<Expense[] | null> {
        return await this.repository.createQueryBuilder("expense")
            .leftJoinAndSelect("expense.payer", "payer")
            .leftJoinAndSelect("expense.payees", "payees")
            .where("expense.groupId = :groupId", { groupId })
            .getMany();
    }

    async findOneByIdWithPayerAndPayees(id: string): Promise<Expense | null> {
        return await this.repository.findOne({ relations: ["payer", "payees"], where: { id } })
    }

    async saveSingle(expense: Expense): Promise<Expense> {
        return await this.repository.save(expense);
    }


    async saveMany(expenses: Expense[]): Promise<Expense[]> {
        return await this.repository.save(expenses);
    }
    
    async removeSingle(expense: Expense): Promise<Expense> {
        return await this.repository.remove(expense);
    }

    async removeMany(expenses: Expense[]): Promise<Expense[]> {
        return await this.repository.remove(expenses);
    }
}
