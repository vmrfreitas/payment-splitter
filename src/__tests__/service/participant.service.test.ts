import { ParticipantService } from "../../service/participant.service";
import { UserRepository } from "../../repository/user.repository";
import { ParticipantRepository } from "../../repository/participant.repository";
import { GroupRepository } from "../../repository/group.repository";
import { Participant } from "../../entity/Participant.entity";
import { User } from "../../entity/User.entity";
import { Group } from "../../entity/Group.entity";
import { mock, MockProxy } from 'jest-mock-extended';

describe('ParticipantService', () => {
    let participantService: ParticipantService;
    let userRepositoryMock: MockProxy<UserRepository>;
    let participantRepositoryMock: MockProxy<ParticipantRepository>;
    let groupRepositoryMock: MockProxy<GroupRepository>;

    beforeEach(() => {
        userRepositoryMock = mock<UserRepository>();
        participantRepositoryMock = mock<ParticipantRepository>();
        groupRepositoryMock = mock<GroupRepository>();

        participantService = new ParticipantService(
            userRepositoryMock,
            participantRepositoryMock,
            groupRepositoryMock
        );
    });

    describe('addParticipantsToGroup', () => {
        it('should add participants to a group successfully', async () => {
            const groupId = 'group-id';
            const userIds = ['user-id-1', 'user-id-2'];
            const mockGroup = new Group();
            groupRepositoryMock.findByIdWithParticipants.mockResolvedValue(mockGroup);
            const mockUsers = userIds.map(userId => {
                const user = new User();
                user.id = userId;
                return user;
            });
            userRepositoryMock.findByIds.mockResolvedValue(mockUsers);

            const participants = await participantService.addParticipantsToGroup(groupId, userIds);

            expect(groupRepositoryMock.findByIdWithParticipants).toHaveBeenCalledWith(groupId);
            expect(userRepositoryMock.findByIds).toHaveBeenCalledWith(userIds);
            expect(participantRepositoryMock.saveMany).toHaveBeenCalledWith(mockUsers.map(user => {
                const participant = new Participant();
                participant.user = user;
                participant.group = mockGroup;
                participant.balance = 0;
                return participant;
            }));
            expect(participants).toBeDefined();
            expect(participants.length).toBe(userIds.length);
        });

        it('should throw an error if group is not found', async () => {
            const groupId = 'non-existent-group-id';
            const userIds = ['user-id-1', 'user-id-2'];
            groupRepositoryMock.findByIdWithParticipants.mockResolvedValue(null);

            await expect(participantService.addParticipantsToGroup(groupId, userIds)).rejects.toThrow("Group or users not found");

            expect(participantRepositoryMock.saveMany).not.toHaveBeenCalled();
        });

        it('should throw an error if not all users are found', async () => {
            const groupId = 'group-id';
            const userIds = ['user-id-1', 'non-existent-user-id'];
            groupRepositoryMock.findByIdWithParticipants.mockResolvedValue(new Group());
            userRepositoryMock.findByIds.mockResolvedValue([new User()]);

            await expect(participantService.addParticipantsToGroup(groupId, userIds)).rejects.toThrow("Group or users not found");

            expect(groupRepositoryMock.findByIdWithParticipants).toHaveBeenCalledWith(groupId);
            expect(userRepositoryMock.findByIds).toHaveBeenCalledWith(userIds);
            expect(participantRepositoryMock.saveMany).not.toHaveBeenCalled();
        });
    });

    describe('getAllParticipantsInGroup', () => {
        it('should return all participants in a group', async () => {
            const groupId = 'group-id';
            const mockParticipants = [new Participant(), new Participant()];
            participantRepositoryMock.findByGroupId.mockResolvedValue(mockParticipants);

            const participants = await participantService.getAllParticipantsInGroup(groupId);

            expect(participants).toStrictEqual(mockParticipants);
        });
    });

    describe('removeParticipantFromGroup', () => {
        it('should remove a participant from a group', async () => {
            const groupId = 'group-id';
            const userId = 'user-id';
            const mockParticipant = new Participant();
            participantRepositoryMock.findOneByUserIdAndGroupId.mockResolvedValue(mockParticipant);

            await participantService.removeParticipantFromGroup(groupId, userId);

            expect(participantRepositoryMock.removeSingle).toHaveBeenCalledWith(mockParticipant);
        });
    });
});