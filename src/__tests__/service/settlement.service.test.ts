import { SettlementService } from "../../service/settlement.service";
import { UserRepository } from "../../repository/user.repository";
import { EmailService } from "../../service/email.service";
import { SettlementRepository } from "../../repository/settlement.repository";
import { ParticipantRepository } from "../../repository/participant.repository";
import { GroupRepository } from "../../repository/group.repository";
import { ExpenseCalculator } from "../../util/expense.calculator";
import { Settlement } from "../../entity/Settlement.entity";
import { Group } from "../../entity/Group.entity";
import { Participant } from "../../entity/Participant.entity";
import { User } from "../../entity/User.entity";
import { mock, MockProxy } from 'jest-mock-extended';

describe('SettlementService', () => {
    let settlementService: SettlementService;
    let userRepositoryMock: MockProxy<UserRepository>;
    let emailServiceMock: MockProxy<EmailService>;
    let settlementRepositoryMock: MockProxy<SettlementRepository>;
    let participantRepositoryMock: MockProxy<ParticipantRepository>;
    let groupRepositoryMock: MockProxy<GroupRepository>;
    let expenseCalculatorMock: MockProxy<ExpenseCalculator>;

    beforeEach(() => {
        userRepositoryMock = mock<UserRepository>();
        emailServiceMock = mock<EmailService>();
        settlementRepositoryMock = mock<SettlementRepository>();
        participantRepositoryMock = mock<ParticipantRepository>();
        groupRepositoryMock = mock<GroupRepository>();
        expenseCalculatorMock = mock<ExpenseCalculator>();

        settlementService = new SettlementService(
            userRepositoryMock,
            emailServiceMock,
            settlementRepositoryMock,
            participantRepositoryMock,
            groupRepositoryMock,
            expenseCalculatorMock,
        );
    });

    describe('addOneSettlementToGroup', () => {
        it('should add a settlement to a group and update balances for payer and payee', async () => {
            const payer = new User();
            payer.id = "payerId";
            const payee = new User();
            payee.id = "payeeId";
            const group = new Group();
            group.id = "groupId";
            group.name = "GroupName";
            const participantPayer = new Participant();
            participantPayer.groupId = group.id;
            participantPayer.userId = payer.id;
            const participantPayee = new Participant();
            participantPayee.groupId = group.id;
            participantPayee.userId = payee.id;
            group.participants = [participantPayer, participantPayee];

            groupRepositoryMock.findByIdWithParticipantsAndSettlements.mockResolvedValue(group);
            userRepositoryMock.findById.mockResolvedValueOnce(payer).mockResolvedValueOnce(payee);

            await settlementService.addOneSettlementToGroup(group.id, 30, payer.id, payee.id);

            expect(expenseCalculatorMock.calculateSettlementBalances).toHaveBeenCalledWith(participantPayer, participantPayee, 30);
            expect(emailServiceMock.sendSettlementNotification).toHaveBeenCalledWith(payer, payee, 30, group.name);
            expect(participantRepositoryMock.saveMany).toHaveBeenCalledWith([participantPayee, participantPayer]);
            expect(settlementRepositoryMock.saveSingle).toHaveBeenCalled();
        });
    });

    describe('getAllSettlementsFromGroup', () => {
        it('should return all settlements in a group', async () => {
            const settlement = new Settlement();
            settlement.amount = 30;
            const group = new Group();
            group.settlements = [settlement];
            group.id = "groupId";

            groupRepositoryMock.findByIdWithSettlements.mockResolvedValue(group);

            const settlements = await settlementService.getAllSettlementsFromGroup("groupId");
            expect(settlements).toStrictEqual([settlement]);
        });
    });

    describe('removeSettlementFromGroup', () => {
        it('should remove a settlement and revert participant balances', async () => {
            const payer = new Participant();
            payer.userId = "payerId";
            payer.balance = 50;
            const payee = new Participant();
            payee.userId = "payeeId";
            payee.balance = -25;

            const settlement = {
                id: "settlement-1",
                amount: 50,
                payer,
                payee,
                group: new Group()
            } as Settlement;

            settlementRepositoryMock.findOneByIdWithPayerAndPayee.mockResolvedValue(settlement);
            await settlementService.removeSettlementFromGroup("groupId", "settlement-1");

            expect(settlementRepositoryMock.findOneByIdWithPayerAndPayee).toHaveBeenCalledWith("settlement-1");
            expect(expenseCalculatorMock.reverseSettlementBalances).toHaveBeenCalledWith(
                payer,
                payee,
                50,
            );
            expect(participantRepositoryMock.saveMany).toHaveBeenCalledWith([payee, payer]);
            expect(settlementRepositoryMock.removeSingle).toHaveBeenCalledWith(settlement);
        });
    });
});