import { Expense } from "../entity/Expense.entity";
import { Group } from "../entity/Group.entity";
import { GroupRepository } from "../repositories/group.repository";
import { ExpenseRepository } from "../repositories/expense.repository";
import { Participant } from "../entity/Participant.entity";
import { ParticipantRepository } from "../repositories/participant.repository";
import { EmailService } from "./email.service";
import { UserRepository } from "../repositories/user.repository";
import { injectable } from "tsyringe";

@injectable()
export class ExpenseService {
    constructor(private userRepository: UserRepository, private emailService: EmailService, private participantRepository: ParticipantRepository, private expenseRepository: ExpenseRepository) {}

    async addOneExpenseToGroup(groupId: string,  description: string, amount: number, payerId: string, payeeIds: string[]): Promise<Expense> {        
        
        const group = await GroupRepository.findOne({ relations: ["expenses", "participants"], where: { id: groupId } });
        const groupParticipants = group.participants;
        const payer = groupParticipants.find((participant) => participant.userId === payerId);
        const payees = groupParticipants.filter((participant) => payeeIds.includes(participant.userId));
        const dividedAmount: number = Math.floor(+amount/(payees.length + 1)*100)/100;
        const remainder = +amount - dividedAmount * (payees.length + 1);
        const owedToPayer = +amount - (dividedAmount + remainder)

        const expense = this.buildExpense(group, payer, payees, description, +amount);

        for (const payee of payees ){
            payee.balance = Math.round((+payee.balance - dividedAmount)*100)/100;
        }
        payer.balance = Math.round((+payer.balance + owedToPayer)*100)/100; // TODO: document that the remainder always goes to the payer

        const payerUser = await this.userRepository.findById(payerId);
        const payeeUsers = await this.userRepository.findByIds(payeeIds);
        await this.emailService.sendExpenseNotification(payerUser, payeeUsers, expense, dividedAmount + remainder, dividedAmount);
        await this.participantRepository.saveMany(payees.concat(payer));
        await this.expenseRepository.saveSingle(expense);
        return expense;
    }

    async getAllExpensesFromGroup(groupId: string): Promise<Expense[]> {
        const group = await GroupRepository.findOne({ relations: ["expenses"], where: { id: groupId } });
        return group.expenses;
    }

    async removeExpenseFromGroup(groupId: string, id: string) {
        const expense = await this.expenseRepository.findOneByIdWithPayerAndPayees(id);
        const payer = expense.payer;
        const payees = expense.payees;
        const payerShare = 1;
        const dividedAmount: number = Math.floor(expense.amount/(payees.length + payerShare)*100)/100;
        const remainder = expense.amount - dividedAmount * (payees.length + payerShare);

        for (const payee of payees ){
            payee.balance = Math.round((+payee.balance + dividedAmount)*100)/100;
        }
        payer.balance = Math.round((+payer.balance - +expense.amount + (dividedAmount + remainder))*100)/100;

        await this.participantRepository.saveMany(payees.concat(payer));
        await this.expenseRepository.removeSingle(expense);
    }

    private buildExpense(group: Group, payer: Participant, payees: Participant[], description: string, amount: number): Expense {
        const expense = new Expense();
        expense.description = description;
        expense.amount = amount;
        expense.payer = payer;
        expense.payees = payees;
        expense.group = group;
        return expense;    
    }
}