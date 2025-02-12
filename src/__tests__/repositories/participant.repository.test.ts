import { DataSource } from "typeorm";
import { User } from "../../entity/User.entity";
import { UserRepository } from "../../repository/user.repository";
import { Participant } from "../../entity/Participant.entity";
import { Expense } from "../../entity/Expense.entity";
import { Group } from "../../entity/Group.entity";
import { Settlement } from "../../entity/Settlement.entity";
import { GroupRepository } from "../../repository/group.repository";
import { ParticipantRepository } from "../../repository/participant.repository";

describe("ParticipantRepository", () => {
    let testDataSource: DataSource;
    let userRepository: UserRepository;
    let groupRepository: GroupRepository;
    let participantRepository: ParticipantRepository;

    beforeAll(async () => {
        testDataSource = new DataSource({
            type: "sqlite",
            database: ":memory:",
            entities: [User, Participant, Expense, Group, Settlement],
            synchronize: true,
        });

        await testDataSource.initialize();
        userRepository = new UserRepository(testDataSource);
        participantRepository = new ParticipantRepository(testDataSource);
        groupRepository = new GroupRepository(testDataSource);
    });

    afterAll(async () => {
        await testDataSource.destroy();
    });

    beforeEach(async () => {
        await testDataSource.getRepository(Participant).clear();
        await testDataSource.getRepository(User).clear();
        await testDataSource.getRepository(Group).clear();
    });

    describe("saveMany", () => {
        it("should save multiple participants to the database", async () => {
            const user = new User();
            user.name = "Test User";
            user.email = "test@example.com";

            const user2 = new User();
            user2.name = "Test User 2";
            user2.email = "test2@example.com";

            const group = new Group();
            group.name = "Group!";
            
            await Promise.all([
                userRepository.saveSingle(user),
                userRepository.saveSingle(user2),
                groupRepository.saveSingle(group)
            ]);
        
            const participant = new Participant();
            participant.group = group;
            participant.user = user;

            const participant2 = new Participant();
            participant2.group = group;
            participant2.user = user2;

            const savedParticipants = await participantRepository.saveMany([participant, participant2]);

            expect(savedParticipants).toHaveLength(2);
            expect(savedParticipants?.map(p => p.userId)).toEqual(
                expect.arrayContaining([user.id, user2.id])
            );
        });
    });

    describe("findByGroupId", () => {
        it("should find participants by groupId", async () => {
            const user = new User();
            user.name = "Test User";
            user.email = "test@example.com";

            const group = new Group();
            group.name = "Group!";
            
            await Promise.all([
                userRepository.saveSingle(user),
                groupRepository.saveSingle(group)
            ]);
        
            const participant = new Participant();
            participant.group = group;
            participant.user = user;

            await participantRepository.saveMany([participant]);
            
            const foundParticipants = await participantRepository.findByGroupId(group.id);

            expect(foundParticipants).toHaveLength(1);
            expect(foundParticipants?.map(p => p.userId)).toEqual(
                expect.arrayContaining([user.id])
            );
        });
    });

    describe("findOneByUserIdAndGroupId", () => {
        it("should find a participant by userId and groupId", async () => {
            const user = new User();
            user.name = "Test User";
            user.email = "test@example.com";

            const group = new Group();
            group.name = "Group!";
            
            await Promise.all([
                userRepository.saveSingle(user),
                groupRepository.saveSingle(group)
            ]);
        
            const participant = new Participant();
            participant.group = group;
            participant.user = user;

            await participantRepository.saveMany([participant]);
            
            const foundParticipant = await participantRepository.findOneByUserIdAndGroupId(user.id, group.id);

            expect(foundParticipant?.userId).toBe(user.id);
        });

        it("should return null when participant not found", async () => {
            const foundParticipant = await participantRepository.findOneByUserIdAndGroupId("non-existent-id", "non-existent-id2");
            expect(foundParticipant).toBeNull();
        });
    });

    describe("removeSingle", () => {
        it("should remove a participant from the database", async () => {
            const user = new User();
            user.name = "Test User";
            user.email = "test@example.com";

            const group = new Group();
            group.name = "Group!";
            
            await Promise.all([
                userRepository.saveSingle(user),
                groupRepository.saveSingle(group)
            ]);
        
            const participant = new Participant();
            participant.group = group;
            participant.user = user;

            await participantRepository.saveMany([participant]);

            await participantRepository.removeSingle(participant);

            const foundParticipant = await participantRepository.findOneByUserIdAndGroupId(user.id, group.id);
            expect(foundParticipant).toBeNull();
        });
    });
});