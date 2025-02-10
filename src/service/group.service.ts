import { Participant } from "../entity/Participant.entity";
import { Group } from "../entity/Group.entity";
import { In } from "typeorm";
import { GroupRepository } from "../repositories/group.repository";
import { UserRepository } from "../repositories/user.repository";
import { ParticipantRepository } from "../repositories/participant.repository";
import { Expense } from "../entity/Expense.entity";
import { Settlement } from "../entity/Settlement.entity";
import { User } from "../entity/User.entity";
import { ExpenseRepository } from "../repositories/expense.repository";
import { SettlementRepository } from "../repositories/settlement.repository";

export class GroupService {

        static async createGroup(name: string, userIds: string[]) {
            const group = new Group()
            group.name = name;
            await GroupRepository.save(group);
       
            const users = await UserRepository.find({ where: { id: In(userIds) } });
    
            const participants = users.map((user) => {
                const participant = new Participant();
                participant.user = user;
                participant.group = group;
                participant.balance = 0;
                return participant;
            });
    
            await ParticipantRepository.save(participants);
            return group;
        }

        static async getAllGroups() {
            return await GroupRepository.find({ relations: ["participants"] });
        }
    
        static async getGroup(groupId: string) {
            const group = await GroupRepository.findOne({ relations: ["participants"], where: { id: groupId } });
            return group;
        }
    
        static async updateGroupName(name: string, groupId: string) {
            const group = await GroupRepository.findOneBy({ id: groupId });
            group.name = name;
            return await GroupRepository.save(group);
        }
    
        static async removeGroup(groupId: string) {
            const group = await GroupRepository.findOne({ relations: ["participants", "expenses", "settlements"], where: { id: groupId } });
            const participants = group.participants;
            const expenses = group.expenses;
            const settlements = group.settlements;
            await ExpenseRepository.remove(expenses);
            await SettlementRepository.remove(settlements);
            await ParticipantRepository.remove(participants);
            await GroupRepository.remove(group);
        }

        static async getTransactionHistory(groupId: string) {
            const expenses = await ExpenseRepository.createQueryBuilder("expense")
                .leftJoinAndSelect("expense.payer", "payer")
                .leftJoinAndSelect("expense.payees", "payees")
                .where("expense.groupId = :groupId", { groupId })
                .getMany();

            const settlements = await SettlementRepository.createQueryBuilder("settlement")
                .leftJoinAndSelect("settlement.payer", "payer")
                .leftJoinAndSelect("settlement.payee", "payee")
                .where("settlement.groupId = :groupId", { groupId })
                .getMany();
            const group = await GroupRepository.findOne({ relations: ["participants"], where: { id: groupId } });
            const users = await UserRepository.find({ where: { id: In(group.participants.map((participant) => participant.userId) ) } });
            return this.buildTransactions(expenses, settlements, users);
        }

        private static buildTransactions(expenses: Expense[], settlements: Settlement[], users: User[]): object{
            const transactions = [];
            for ( const expense of expenses ) {
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

            for ( const settlement of settlements ) {
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