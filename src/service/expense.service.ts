import { Expense } from "../entity/Expense.entity";
import { User } from "../entity/User.entity";
import { Group } from "../entity/Group.entity";
import { In } from "typeorm";
import { GroupRepository } from "../repositories/group.repository";
import { UserRepository } from "../repositories/user.repository";
import { ExpenseRepository } from "../repositories/expense.repository";
import { Participant } from "../entity/Participant.entity";
import { ParticipantRepository } from "../repositories/participant.repository";

export class ExpenseService {
    static async addOneExpenseToGroup(groupId: string,  description: string, amount: number, payerId: string, payeesId: string): Promise<Expense> {        
        
        const group = await GroupRepository.findOne({ relations: ["expenses", "participants"], where: { id: groupId } });
        const groupParticipants = group.participants;
        const payer = groupParticipants.find((participant) => participant.userId === payerId);
        const payees = groupParticipants.filter((participant) => payeesId.includes(participant.userId));
        const payerShare = 1;
        const dividedAmount = amount/(payees.length + payerShare);

        const expense = this.buildExpense(group, payer, payees, description, amount);

        if (group.expenses) {
            group.expenses.concat(expense);
        } else {
            group.expenses = [expense];
        }

        for (const payee of payees ){
            payee.balance -= dividedAmount;
        }
        payer.balance += dividedAmount;

        await GroupRepository.save(group);
        await ParticipantRepository.save(payees.concat(payer));
        await ExpenseRepository.save(expense);
        return expense;
    }

    static async getAllExpensesFromGroup(id: string): Promise<Expense[]> {
        return Promise.resolve([]);

    }

    static async removeExpenseFromGroup(groupId: string, id: string) {
        
    }

    private static buildExpense(group: Group, payer: Participant, payees: Participant[], description: string, amount: number): Expense {
        const expense = new Expense();
        expense.description = description;
        expense.amount = amount;
        expense.payer = payer;
        expense.payees = payees;
        expense.group = group;
        return expense;    
    }
}