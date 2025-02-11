import { DataSource } from "typeorm";
import { User } from "../../entity/User.entity";
import { UserRepository } from "../../repository/user.repository";
import { Participant } from "../../entity/Participant.entity";
import { Expense } from "../../entity/Expense.entity";
import { Group } from "../../entity/Group.entity";
import { Settlement } from "../../entity/Settlement.entity";

describe("UserRepository", () => {
    let testDataSource: DataSource;
    let userRepository: UserRepository;

    beforeAll(async () => {
        testDataSource = new DataSource({
            type: "sqlite",
            database: ":memory:",
            entities: [User, Participant, Expense, Group, Settlement],
            synchronize: true,
        });

        await testDataSource.initialize();
        userRepository = new UserRepository(testDataSource);
    });

    afterAll(async () => {
        await testDataSource.destroy();
    });

    beforeEach(async () => {
        await testDataSource.getRepository(User).clear();
    });

    describe("saveSingle", () => {
        it("should save a user to the database", async () => {
            const user = new User();
            user.name = "Test User";
            user.email = "test@example.com";

            const savedUser = await userRepository.saveSingle(user);

            expect(savedUser.id).toBeDefined();
            expect(savedUser.name).toBe("Test User");
        });
    });

    describe("findById", () => {
        it("should find a user by id", async () => {
            const user = await userRepository.saveSingle(
                Object.assign(new User(), {
                    name: "Find User",
                    email: "find@example.com",
                })
            );

            const foundUser = await userRepository.findById(user.id);

            expect(foundUser?.id).toBe(user.id);
            expect(foundUser?.name).toBe("Find User");
        });

        it("should return null when user not found", async () => {
            const foundUser = await userRepository.findById("non-existent-id");
            expect(foundUser).toBeNull();
        });
    });

    describe("findAll", () => {
        it("should return all users", async () => {
            await userRepository.saveSingle(
                Object.assign(new User(), {
                    name: "User 1",
                    email: "user1@example.com",
                })
            );

            await userRepository.saveSingle(
                Object.assign(new User(), {
                    name: "User 2",
                    email: "user2@example.com",
                })
            );

            const users = await userRepository.findAll();

            expect(users).toHaveLength(2);
            expect(users?.map(u => u.name)).toEqual(
                expect.arrayContaining(["User 1", "User 2"])
            );
        });
    });

    describe("findByIdWithParticipants", () => {
        it("should find user with participants relation", async () => {
            const user = await userRepository.saveSingle(
                Object.assign(new User(), {
                    name: "User with Participants",
                    email: "participants@example.com",
                })
            );

            const foundUser = await userRepository.findByIdWithParticipants(user.id);

            expect(foundUser?.id).toBe(user.id);
            expect(foundUser?.participants).toBeDefined();
        });
    });

    describe("findByIds", () => {
        it("should find users by multiple ids", async () => {
            const user1 = await userRepository.saveSingle(
                Object.assign(new User(), {
                    name: "User 1",
                    email: "user1@example.com",
                })
            );

            const user2 = await userRepository.saveSingle(
                Object.assign(new User(), {
                    name: "User 2",
                    email: "user2@example.com",
                })
            );

            const users = await userRepository.findByIds([user1.id, user2.id]);

            expect(users).toHaveLength(2);
            expect(users?.map(u => u.id)).toEqual(
                expect.arrayContaining([user1.id, user2.id])
            );
        });
    });

    describe("removeSingle", () => {
        it("should remove a user from the database", async () => {
            const user = await userRepository.saveSingle(
                Object.assign(new User(), {
                    name: "To Delete",
                    email: "delete@example.com",
                })
            );

            await userRepository.removeSingle(user);

            const foundUser = await userRepository.findById(user.id);
            expect(foundUser).toBeNull();
        });
    });
});