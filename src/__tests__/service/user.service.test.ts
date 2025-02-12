import { UserService } from "../../service/user.service";
import { UserRepository } from "../../repository/user.repository";
import { ParticipantRepository } from "../../repository/participant.repository";
import { User } from "../../entity/User.entity";
import { mock, MockProxy } from 'jest-mock-extended';
import { Participant } from "../../entity/Participant.entity";

describe('UserService', () => {
    let userService: UserService;
    let userRepositoryMock: MockProxy<UserRepository>;
    let participantRepositoryMock: MockProxy<ParticipantRepository>;

    beforeEach(() => {
        userRepositoryMock = mock<UserRepository>();
        participantRepositoryMock = mock<ParticipantRepository>();

        userService = new UserService(
            userRepositoryMock,
            participantRepositoryMock,
        );
    });

    describe('createUser', () => {
        it('should create a new user', async () => {
            const user = new User();
            user.id = "userId";
            user.name = "Test User";
            user.email = "test@example.com";
            userRepositoryMock.saveSingle.mockResolvedValue(user);

            const createdUser = await userService.createUser(user.name, user.email);

            expect(userRepositoryMock.saveSingle).toHaveBeenCalledWith(expect.objectContaining({ name: user.name, email: user.email }));
            expect(createdUser).toEqual(user);
        });
    });

    describe('getAllUsers', () => {
        it('should return all users', async () => {
            const users = [
                { id: 'user1', name: 'User 1', email: 'user1@example.com' } as User,
                { id: 'user2', name: 'User 2', email: 'user2@example.com' } as User
            ];
            userRepositoryMock.findAll.mockResolvedValue(users);

            const allUsers = await userService.getAllUsers();

            expect(userRepositoryMock.findAll).toHaveBeenCalled();
            expect(allUsers).toEqual(users);
        });
    });

    describe('getUser', () => {
        it('should return a user by id with participants', async () => {
            const user = new User();
            user.id = "userId";
            userRepositoryMock.findByIdWithParticipants.mockResolvedValue(user);

            const retrievedUser = await userService.getUser(user.id);

            expect(userRepositoryMock.findByIdWithParticipants).toHaveBeenCalledWith(user.id);
            expect(retrievedUser).toEqual(user);
        });
    });

    describe('deleteUser', () => {
        it('should delete a user and their participants', async () => {
            const user = new User();
            user.id = "userId";
            const participants = [{ userId: 'userId', groupId: 'groupId' } as Participant];
            user.participants = participants;

            userRepositoryMock.findByIdWithParticipants.mockResolvedValue(user);

            await userService.deleteUser(user.id);

            expect(userRepositoryMock.findByIdWithParticipants).toHaveBeenCalledWith(user.id);
            expect(participantRepositoryMock.removeMany).toHaveBeenCalledWith(participants);
            expect(userRepositoryMock.removeSingle).toHaveBeenCalledWith(user);
        });
    });
});