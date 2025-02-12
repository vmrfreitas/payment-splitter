import { DataSource } from "typeorm";
import { User } from "../../entity/User.entity";
import { SettlementRepository } from "../../repository/settlement.repository";
import { Participant } from "../../entity/Participant.entity";
import { Group } from "../../entity/Group.entity";
import { Expense } from "../../entity/Expense.entity";
import { Settlement } from "../../entity/Settlement.entity";
import { GroupRepository } from "../../repository/group.repository";

describe("SettlementRepository", () => {
    let testDataSource: DataSource;
    let settlementRepository: SettlementRepository;
    let groupRepository: GroupRepository;

    beforeAll(async () => {
        testDataSource = new DataSource({
            type: "sqlite",
            database: ":memory:",
            entities: [User, Participant, Group, Expense, Settlement],
            synchronize: true,
        });

        await testDataSource.initialize();
        settlementRepository = new SettlementRepository(testDataSource);
        groupRepository = new GroupRepository(testDataSource);
    });

    afterAll(async () => {
        await testDataSource.destroy();
    });

    beforeEach(async () => {
        await testDataSource.getRepository(Settlement).clear();
        await testDataSource.getRepository(Group).clear();
    });

    describe("saveSingle", () => {
        it("should save a settlement to the database", async () => {
            const settlement = new Settlement();
            settlement.amount = 100;

            const savedSettlement = await settlementRepository.saveSingle(settlement);

            expect(savedSettlement.id).toBeDefined();
            expect(savedSettlement.amount).toBe(100);
        });
    });

    describe("findOneByIdWithPayerAndPayee", () => {
        it("should find one settlement with payer and payee relations", async () => {
            const settlement = await settlementRepository.saveSingle(
                Object.assign(new Settlement(), {
                    amount: 999
                })
            );

            const foundSettlement = await settlementRepository.findOneByIdWithPayerAndPayee(settlement.id);

            expect(foundSettlement?.id).toBe(settlement.id);
            expect(foundSettlement?.payer).toBeDefined();
            expect(foundSettlement?.payee).toBeDefined();
        });
    });

    describe("findByGroupIdWithPayerAndPayee", () => {
        it("should find settlements by group id with payer and payee relations", async () => {
            const settlement = await settlementRepository.saveSingle(
                Object.assign(new Settlement(), {
                    amount: 99
                })
            );

            const group = await groupRepository.saveSingle(
                Object.assign(new Group(), {
                    name: "Test Group",
                    settlements: [settlement]
                })
            );

            const foundSettlements = await settlementRepository.findByGroupIdWithPayerAndPayee(group.id);

            const foundSettlement = foundSettlements[0];
            expect(foundSettlement.amount).toEqual(99);
            expect(foundSettlement.payer).toBeDefined();
            expect(foundSettlement.payee).toBeDefined();
        });
    });

    describe("removeSingle", () => {
        it("should remove a settlement from the database", async () => {
            const settlement = await settlementRepository.saveSingle(
                Object.assign(new Settlement(), {
                    description: "To Delete",
                    amount: 666
                })
            );

            await settlementRepository.removeSingle(settlement);

            const foundSettlement = await settlementRepository.findOneByIdWithPayerAndPayee(settlement.id);
            expect(foundSettlement).toBeNull();
        });
    });

    describe("removeMany", () => {
        it("should remove multiple settlements from the database", async () => {
            const settlement1 = new Settlement();
            settlement1.amount = 1;

            const settlement2 = new Settlement();
            settlement2.amount = 2;

            await settlementRepository.saveSingle(settlement1);
            await settlementRepository.saveSingle(settlement2);

            await settlementRepository.removeMany([settlement1, settlement2]);

            const foundSettlement1 = await settlementRepository.findOneByIdWithPayerAndPayee(settlement1.id);
            expect(foundSettlement1).toBeNull();
            const foundSettlement2 = await settlementRepository.findOneByIdWithPayerAndPayee(settlement2.id);
            expect(foundSettlement2).toBeNull();
        });
    });
});