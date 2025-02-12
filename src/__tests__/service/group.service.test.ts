import { GroupService } from "../../service/group.service";
import { UserRepository } from "../../repository/user.repository";
import { ParticipantRepository } from "../../repository/participant.repository";
import { ExpenseRepository } from "../../repository/expense.repository";
import { GroupRepository } from "../../repository/group.repository";
import { SettlementRepository } from "../../repository/settlement.repository";
import { Group } from "../../entity/Group.entity";
import { User } from "../../entity/User.entity";
import { Participant } from "../../entity/Participant.entity";
import { mock, MockProxy } from 'jest-mock-extended';
import { Expense } from "../../entity/Expense.entity";
import { Settlement } from "../../entity/Settlement.entity";

describe('GroupService', () => {
    let groupService: GroupService;
    let userRepositoryMock: MockProxy<UserRepository>;
    let settlementRepositoryMock: MockProxy<SettlementRepository>;
    let participantRepositoryMock: MockProxy<ParticipantRepository>;
    let expenseRepositoryMock: MockProxy<ExpenseRepository>;
    let groupRepositoryMock: MockProxy<GroupRepository>;

    beforeEach(() => {
        userRepositoryMock = mock<UserRepository>();
        settlementRepositoryMock = mock<SettlementRepository>();
        participantRepositoryMock = mock<ParticipantRepository>();
        expenseRepositoryMock = mock<ExpenseRepository>();
        groupRepositoryMock = mock<GroupRepository>();

        groupService = new GroupService(
            userRepositoryMock,
            settlementRepositoryMock,
            participantRepositoryMock,
            expenseRepositoryMock,
            groupRepositoryMock,
        );
    });

    describe('createGroup', () => {
        it('should create a group with participants', async () => {
            const userIds = ['user-id-1', 'user-id-2'];
            const mockUsers = userIds.map(id => {
                const user = new User();
                user.id = id;
                return user;
            });
            userRepositoryMock.findByIds.mockResolvedValue(mockUsers);
            groupRepositoryMock.saveSingle.mockResolvedValue(new Group());
            participantRepositoryMock.saveMany.mockResolvedValue([]);

            const group = await groupService.createGroup('Test Group', userIds);

            expect(groupRepositoryMock.saveSingle).toHaveBeenCalledWith(group);
            expect(userRepositoryMock.findByIds).toHaveBeenCalledWith(userIds);
            expect(participantRepositoryMock.saveMany).toHaveBeenCalledWith([{
                user: mockUsers[0],
                group: group,
                balance: 0
            }, {
                user: mockUsers[1],
                group: group,
                balance: 0
            }
            ] as Participant[]);
            expect(group).toBeDefined();
        });
    });

    describe('getAllGroups', () => {
        it('should return all groups', async () => {
            groupRepositoryMock.findAllWithParticipants.mockResolvedValue([new Group(), new Group()]);

            const groups = await groupService.getAllGroups();

            expect(groupRepositoryMock.findAllWithParticipants).toHaveBeenCalled();
            expect(groups).toBeDefined();
        });
    });

    describe('getGroup', () => {
        it('should return a group by id', async () => {
            const groupId = 'group-id';
            groupRepositoryMock.findByIdWithParticipants.mockResolvedValue(new Group());

            const group = await groupService.getGroup(groupId);

            expect(groupRepositoryMock.findByIdWithParticipants).toHaveBeenCalledWith(groupId);
            expect(group).toBeDefined();
        });
    });

    describe('updateGroupName', () => {
        it('should update the name of a group', async () => {
            const groupId = 'group-id';
            const newName = 'New Group Name';
            const mockGroup = new Group();
            groupRepositoryMock.findById.mockResolvedValue(mockGroup);
            groupRepositoryMock.saveSingle.mockResolvedValue(mockGroup);

            const group = await groupService.updateGroupName(newName, groupId);

            expect(groupRepositoryMock.findById).toHaveBeenCalledWith(groupId);
            expect(groupRepositoryMock.saveSingle).toHaveBeenCalledWith(mockGroup);
            expect(group.name).toBe(newName);
        });
    });

    describe('removeGroup', () => {
        it('should remove a group and its related entities', async () => {
            const groupId = 'group-id';
            const mockGroup = new Group();
            mockGroup.participants = [new Participant()];
            mockGroup.expenses = [new Expense()];
            mockGroup.settlements = [new Settlement()];
            groupRepositoryMock.findByIdWithParticipantsAndExpensesAndSettlements.mockResolvedValue(mockGroup);
            expenseRepositoryMock.removeMany.mockResolvedValue([]);
            settlementRepositoryMock.removeMany.mockResolvedValue([]);
            participantRepositoryMock.removeMany.mockResolvedValue([]);
            groupRepositoryMock.removeSingle.mockResolvedValue(new Group());

            await groupService.removeGroup(groupId);

            expect(groupRepositoryMock.findByIdWithParticipantsAndExpensesAndSettlements).toHaveBeenCalledWith(groupId);
            expect(expenseRepositoryMock.removeMany).toHaveBeenCalledWith(mockGroup.expenses);
            expect(settlementRepositoryMock.removeMany).toHaveBeenCalledWith(mockGroup.settlements);
            expect(participantRepositoryMock.removeMany).toHaveBeenCalledWith(mockGroup.participants);
            expect(groupRepositoryMock.removeSingle).toHaveBeenCalledWith(mockGroup);
        });
    });
});