import { Expense } from "../entity/Expense.entity";
import { User } from "../entity/User.entity";
import { Group } from "../entity/Group.entity";
import { In } from "typeorm";
import { GroupRepository } from "../repositories/group.repository";
import { UserRepository } from "../repositories/user.repository";
import { ExpenseRepository } from "../repositories/expense.repository";

export class ExpenseService {
    static async addExpenses(groupId: string, userIds: string[]): Promise<Expense[]> {
    }

    static async findExpenses(id: string): Promise<Expense[]> {
    }

    static async removeExpense(id: string) {
        
    }

    private static buildExpenses(users: User[], group: Group): Expense[] {
        return users.map((user) => {
            const expense = new Expense();
           // expense.user = user;
            expense.group = group;
            //expense.balance = 0;
            return expense;
        });
    }
}