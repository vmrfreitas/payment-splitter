import { Settlement } from "../entity/Settlement.entity";
import { Group } from "../entity/Group.entity";
import { GroupRepository } from "../repositories/group.repository";
import { SettlementRepository } from "../repositories/settlement.repository";
import { Participant } from "../entity/Participant.entity";
import { ParticipantRepository } from "../repositories/participant.repository";
import { EmailService } from "./email.service";
import { UserRepository } from "../repositories/user.repository";
import { injectable } from "tsyringe";
import { ExpenseCalculator } from "../util/expense.calculator";

@injectable()
export class SettlementService {
    constructor(
        private userRepository: UserRepository, 
        private emailService: EmailService, 
        private settlementRepository: SettlementRepository, 
        private participantRepository: ParticipantRepository,
        private groupRepository: GroupRepository,
        private expenseCalculator: ExpenseCalculator) {}

    async addOneSettlementToGroup(
        groupId: string, 
        amount: number, 
        payerId: string, 
        payeeId: string
    ): Promise<Settlement> {
        const group = await this.groupRepository.findByIdWithParticipantsAndSettlements(groupId);
        const groupParticipants = group.participants;
        const payer = groupParticipants.find((participant) => participant.userId === payerId);
        const payee = groupParticipants.find((participant) => payeeId === participant.userId);

        const settlement = this.buildSettlement(group, payer, payee, amount);

        this.expenseCalculator.calculateSettlementBalances(payer, payee, amount);

        const payerUser = await this.userRepository.findById(payerId);
        const payeeUser = await this.userRepository.findById(payeeId);
        await this.emailService.sendSettlementNotification(payerUser, payeeUser, amount, group.name);
        await this.participantRepository.saveMany([payee, payer]);
        return await this.settlementRepository.saveSingle(settlement);
    }

    async getAllSettlementsFromGroup(groupId: string): Promise<Settlement[]> {
        const group = await this.groupRepository.findByIdWithSettlements(groupId);
        return group.settlements;
    }

    async removeSettlementFromGroup(groupId: string, id: string) {
        const settlement = await this.settlementRepository.findOneByIdWithPayerAndPayee(id);
        const payer = settlement.payer;
        const payee = settlement.payee;

        this.expenseCalculator.reverseSettlementBalances(payer, payee, settlement.amount);

        await this.participantRepository.saveMany([payee, payer]);
        await this.settlementRepository.removeSingle(settlement);
    }

    private buildSettlement(group: Group, payer: Participant, payee: Participant, amount: number): Settlement {
        const settlement = new Settlement();
        settlement.amount = amount;
        settlement.payer = payer;
        settlement.payee = payee;
        settlement.group = group;
        return settlement;    
    }
}