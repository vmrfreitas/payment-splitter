import { Settlement } from "../entity/Settlement.entity";
import { Group } from "../entity/Group.entity";
import { GroupRepository } from "../repositories/group.repository";
import { SettlementRepository } from "../repositories/settlement.repository";
import { Participant } from "../entity/Participant.entity";
import { ParticipantRepository } from "../repositories/participant.repository";
import { EmailService } from "./email.service";
import { UserRepository } from "../repositories/user.repository";
import { injectable } from "tsyringe";

@injectable()
export class SettlementService {
    constructor(private userRepository: UserRepository, private emailService: EmailService, private settlementRepository: SettlementRepository, private participantRepository: ParticipantRepository) {}

    async addOneSettlementToGroup(groupId: string, amount: number, payerId: string, payeeId: string): Promise<Settlement> {
        const group = await GroupRepository.findOne({ relations: ["settlements", "participants"], where: { id: groupId } });
        const groupParticipants = group.participants;
        const payer = groupParticipants.find((participant) => participant.userId === payerId);
        const payee = groupParticipants.find((participant) => payeeId === participant.userId);

        const settlement = this.buildSettlement(group, payer, payee, amount);

        payee.balance = Math.round((+payee.balance - +amount)*100)/100;
        payer.balance = Math.round((+payer.balance + +amount)*100)/100;

        const payerUser = await this.userRepository.findById(payerId);
        const payeeUser = await this.userRepository.findById(payeeId);
        await this.emailService.sendSettlementNotification(payerUser, payeeUser, amount, group.name);
        await this.participantRepository.saveMany([payee, payer]);
        await this.settlementRepository.saveSingle(settlement);
        return settlement;
    }

    async getAllSettlementsFromGroup(groupId: string): Promise<Settlement[]> {
        const group = await GroupRepository.findOne({ relations: ["settlements"], where: { id: groupId } });
        return group.settlements;
    }

    async removeSettlementFromGroup(groupId: string, id: string) {
        const settlement = await this.settlementRepository.findOneByIdWithPayerAndPayee(id);
        const payer = settlement.payer;
        const payee = settlement.payee;

        payee.balance =  Math.round((+payee.balance + +settlement.amount)*100)/100;
        payer.balance = Math.round((+payer.balance - +settlement.amount)*100)/100;

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