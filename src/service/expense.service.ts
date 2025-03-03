import { Expense } from "../entity/Expense.entity";
import { Group } from "../entity/Group.entity";
import { GroupRepository } from "../repository/group.repository";
import { ExpenseRepository } from "../repository/expense.repository";
import { Participant } from "../entity/Participant.entity";
import { ParticipantRepository } from "../repository/participant.repository";
import { EmailService } from "./email.service";
import { UserRepository } from "../repository/user.repository";
import { injectable } from "tsyringe";
import { ExpenseCalculator } from "../util/expense.calculator";
import { S3Service } from "./s3.service";

@injectable()
export class ExpenseService {
    constructor(
        private userRepository: UserRepository,
        private emailService: EmailService,
        private participantRepository: ParticipantRepository,
        private expenseRepository: ExpenseRepository,
        private groupRepository: GroupRepository,
        private expenseCalculator: ExpenseCalculator,
        private s3Service: S3Service) { }

    async addOneExpenseToGroup(groupId: string, description: string, amount: number, payerId: string, payeeIds: string[]): Promise<Expense> {
        const group = await this.groupRepository.findByIdWithExpensesAndParticipants(groupId);
        const groupParticipants = group.participants;

        const payer = groupParticipants.find((participant) => participant.userId === payerId);
        let payees: Participant[] = [];
        if (!Array.isArray(payeeIds) || payeeIds.length == 0){
            payees = group.participants.filter((participant) => participant.userId !== payerId);
        } else {
            payees = groupParticipants.filter((participant) => payeeIds.includes(participant.userId));
        }
        
        const { dividedAmount, remainder } = this.expenseCalculator.calculateSplit(
            amount,
            payees.length + 1 // +1 for payer
        );

        this.expenseCalculator.calculateBalancesOnAdd(
            payer,
            payees,
            amount,
            dividedAmount,
            remainder
        );

        const expense = this.buildExpense(group, payer, payees, description, +amount);

        const payerUser = await this.userRepository.findById(payerId);
        const payeeUsers = await this.userRepository.findByIds(payees.map(payee => payee.userId));
        await this.emailService.sendExpenseNotification(payerUser, payeeUsers, expense, dividedAmount + remainder, dividedAmount);
        await this.participantRepository.saveMany(payees.concat(payer));
        await this.expenseRepository.saveSingle(expense);
        return expense;
    }

    
    async importExpensesFromS3(key: string, groupId: string): Promise<Expense[]> {
        const group = await this.groupRepository.findByIdWithParticipants(groupId);
        const participants = group.participants;

        const rawExpenses = await this.s3Service.getExpensesFromCSV(key, group, participants);

        for (const expense of rawExpenses) {
            const { dividedAmount, remainder } = expense.calculationMetadata;

            this.expenseCalculator.calculateBalancesOnAdd(
                expense.payer,
                expense.payees,
                expense.amount,
                dividedAmount,
                remainder
            );
        }

        await this.participantRepository.saveMany(participants);
        await this.expenseRepository.saveMany(rawExpenses);
        return rawExpenses;
    }

    async getAllExpensesFromGroup(groupId: string): Promise<Expense[]> {
        const group = await this.groupRepository.findByIdWithExpenses(groupId);
        return group.expenses;
    }

    async removeExpenseFromGroup(id: string) {
        const expense = await this.expenseRepository.findOneByIdWithPayerAndPayees(id);

        const { payer, payees, amount } = expense;

        const { dividedAmount, remainder } = this.expenseCalculator.calculateSplit(
            amount,
            payees.length + 1 // +1 for payer
        );

        this.expenseCalculator.calculateBalancesOnRemove(
            payer,
            payees,
            amount,
            dividedAmount,
            remainder
        );

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