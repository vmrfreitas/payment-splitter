import { DataSource } from "typeorm";
import { User } from "../../entity/User.entity";
import { GroupRepository } from "../../repository/group.repository";
import { Participant } from "../../entity/Participant.entity";
import { Expense } from "../../entity/Expense.entity";
import { Group } from "../../entity/Group.entity";
import { Settlement } from "../../entity/Settlement.entity";

describe("GroupRepository", () => {
    let testDataSource: DataSource;
    let groupRepository: GroupRepository;

    beforeAll(async () => {
        testDataSource = new DataSource({
            type: "sqlite",
            database: ":memory:",
            entities: [User, Participant, Expense, Group, Settlement],
            synchronize: true,
        });

        await testDataSource.initialize();
        groupRepository = new GroupRepository(testDataSource);
    });

    afterAll(async () => {
        await testDataSource.destroy();
    });

    beforeEach(async () => {
        await testDataSource.getRepository(Group).clear();
    });

    describe("saveSingle", () => {
        it("should save a group to the database", async () => {
            const group = new Group();
            group.name = "Test Group";

            const savedGroup = await groupRepository.saveSingle(group);

            expect(savedGroup.id).toBeDefined();
            expect(savedGroup.name).toBe("Test Group");
        });
    });

    describe("findById", () => {
        it("should find a user by id", async () => {
            const user = await groupRepository.saveSingle(
                Object.assign(new Group(), {
                    name: "Find Group",
                    email: "find@example.com",
                })
            );

            const foundGroup = await groupRepository.findById(user.id);

            expect(foundGroup?.id).toBe(user.id);
            expect(foundGroup?.name).toBe("Find Group");
        });

        it("should return null when user not found", async () => {
            const foundGroup = await groupRepository.findById("non-existent-id");
            expect(foundGroup).toBeNull();
        });
    });

    describe("findAllWithParticipants", () => {
        it("should return all groups with participants relation", async () => {
            await groupRepository.saveSingle(
                Object.assign(new Group(), {
                    name: "Group 1"
                })
            );

            await groupRepository.saveSingle(
                Object.assign(new Group(), {
                    name: "Group 2"
                })
            );

            const groups = await groupRepository.findAllWithParticipants();

            expect(groups).toHaveLength(2);
            expect(groups?.map(g => g.name)).toEqual(
                expect.arrayContaining(["Group 1", "Group 2"])
            );
        });
    });

    describe("findByIdWithParticipants", () => {
        it("should find group with participants relation", async () => {
            const group = await groupRepository.saveSingle(
                Object.assign(new Group(), {
                    name: "Group with Participants"
                })
            );

            const foundGroup = await groupRepository.findByIdWithParticipants(group.id);

            expect(foundGroup?.id).toBe(group.id);
            expect(foundGroup?.participants).toBeDefined();
        });
    });

    describe("removeSingle", () => {
        it("should remove a user from the database", async () => {
            const user = await groupRepository.saveSingle(
                Object.assign(new Group(), {
                    name: "To Delete",
                    email: "delete@example.com",
                })
            );

            await groupRepository.removeSingle(user);

            const foundGroup = await groupRepository.findById(user.id);
            expect(foundGroup).toBeNull();
        });
    });
});