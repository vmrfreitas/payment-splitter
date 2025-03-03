import { Participant } from "../entity/Participant.entity";
import { Group } from "../entity/Group.entity";
import { GroupRepository } from "../repository/group.repository";
import { UserRepository } from "../repository/user.repository";
import { ParticipantRepository } from "../repository/participant.repository";
import { Expense } from "../entity/Expense.entity";
import { Settlement } from "../entity/Settlement.entity";
import { User } from "../entity/User.entity";
import { ExpenseRepository } from "../repository/expense.repository";
import { SettlementRepository } from "../repository/settlement.repository";
import { injectable } from "tsyringe";

@injectable()
export class GroupService {
    constructor(
        private userRepository: UserRepository,
        private settlementRepository: SettlementRepository,
        private participantRepository: ParticipantRepository,
        private expenseRepository: ExpenseRepository,
        private groupRepository: GroupRepository) { }

    async createGroup(name: string, userIds: string[]) {
        const group = new Group()
        group.name = name;
        await this.groupRepository.saveSingle(group);
        
        if (!Array.isArray(userIds) || userIds.length == 0){
           return group;
        }

        const users = await this.userRepository.findByIds(userIds);

        const participants = users.map((user) => {
            const participant = new Participant();
            participant.user = user;
            participant.group = group;
            participant.balance = 0;
            return participant;
        });

        await this.participantRepository.saveMany(participants);
        return group;
    }

    async getAllGroups() {
        return await this.groupRepository.findAllWithParticipants();
    }

    async getGroup(groupId: string) {
        const group = await this.groupRepository.findByIdWithParticipants(groupId);
        return group;
    }

    async updateGroupName(name: string, groupId: string) {
        const group = await this.groupRepository.findById(groupId);
        group.name = name;
        return await this.groupRepository.saveSingle(group);
    }

    async removeGroup(groupId: string) {
        const group = await this.groupRepository.findByIdWithParticipantsAndExpensesAndSettlements(groupId);
        const participants = group.participants;
        const expenses = group.expenses;
        const settlements = group.settlements;
        await this.expenseRepository.removeMany(expenses);
        await this.settlementRepository.removeMany(settlements);
        await this.participantRepository.removeMany(participants);
        await this.groupRepository.removeSingle(group);
    }

    async getTransactionHistory(groupId: string) {
        const expenses = await this.expenseRepository.findByGroupIdWithPayerAndPayees(groupId);
        const settlements = await this.settlementRepository.findByGroupIdWithPayerAndPayee(groupId);
        const group = await this.groupRepository.findByIdWithParticipants(groupId);
        const users = await this.userRepository.findByIds(group.participants.map((participant) => participant.userId));
        return this.buildTransactions(expenses, settlements, users);
    }

    private buildTransactions(expenses: Expense[], settlements: Settlement[], users: User[]): object {
        const transactions = [];
        for (const expense of expenses) {
            transactions.push({
                id: expense.id,
                type: "expense",
                payer: users.find((user) => user.id === expense.payer.userId).name,
                payees: expense.payees.map((payee) => users.find((user) => user.id === payee.userId).name),
                amount: expense.amount,
                description: expense.description,
                createdAt: expense.createdAt
            });
        }

        for (const settlement of settlements) {
            transactions.push({
                id: settlement.id,
                type: "settlement",
                payer: users.find((user) => user.id === settlement.payer.userId).name,
                payee: users.find((user) => user.id === settlement.payee.userId).name,
                amount: settlement.amount,
                createdAt: settlement.createdAt
            });
        }

        return [...transactions].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }

}