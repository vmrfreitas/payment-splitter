import { DataSource } from "typeorm";
import { User } from "../../entity/User.entity";
import { ExpenseRepository } from "../../repository/expense.repository";
import { Participant } from "../../entity/Participant.entity";
import { Group } from "../../entity/Group.entity";
import { Expense } from "../../entity/Expense.entity";
import { Settlement } from "../../entity/Settlement.entity";
import { GroupRepository } from "../../repository/group.repository";

describe("ExpenseRepository", () => {
    let testDataSource: DataSource;
    let expenseRepository: ExpenseRepository;
    let groupRepository: GroupRepository;

    beforeAll(async () => {
        testDataSource = new DataSource({
            type: "sqlite",
            database: ":memory:",
            entities: [User, Participant, Group, Expense, Settlement],
            synchronize: true,
        });

        await testDataSource.initialize();
        expenseRepository = new ExpenseRepository(testDataSource);
        groupRepository = new GroupRepository(testDataSource);
    });

    afterAll(async () => {
        await testDataSource.destroy();
    });

    beforeEach(async () => {
        await testDataSource.getRepository(Expense).clear();
        await testDataSource.getRepository(Group).clear();
    });

    describe("saveSingle", () => {
        it("should save an expense to the database", async () => {
            const expense = new Expense();
            expense.description = "Test Expense";
            expense.amount = 100;

            const savedExpense = await expenseRepository.saveSingle(expense);

            expect(savedExpense.id).toBeDefined();
            expect(savedExpense.description).toBe("Test Expense");
        });
    });

    describe("saveMany", () => {
        it("should save multiple expenses to the database", async () => {
            const expense1 = new Expense();
            expense1.description = "Test Expense";
            expense1.amount = 1;

            const expense2 = new Expense();
            expense2.description = "Test Expense 2";
            expense2.amount = 2;

            const savedExpenses = await expenseRepository.saveMany([expense1, expense2]);

            expect(savedExpenses).toHaveLength(2);
            expect(savedExpenses?.map(e => e.description)).toEqual(
                expect.arrayContaining(["Test Expense", "Test Expense 2"])
            );
        });
    });

    describe("findOneByIdWithPayerAndPayees", () => {
        it("should find one expense with payer and payees relations", async () => {
            const expense = await expenseRepository.saveSingle(
                Object.assign(new Expense(), {
                    description: "Expense with Payer and Payees",
                    amount: 999
                })
            );

            const foundExpense = await expenseRepository.findOneByIdWithPayerAndPayees(expense.id);

            expect(foundExpense?.id).toBe(expense.id);
            expect(foundExpense?.payer).toBeDefined();
            expect(foundExpense?.payees).toBeDefined();
        });
    });

    describe("findByGroupIdWithPayerAndPayees", () => {
        it("should find expenses by group id with payer and payees relations", async () => {
            const expense = await expenseRepository.saveSingle(
                Object.assign(new Expense(), {
                    description: "Expense with Payer and Payees",
                    amount: 999
                })
            );

            const group = await groupRepository.saveSingle(
                Object.assign(new Group(), {
                    name: "Test Group",
                    expenses: [expense]
                })
            );

            const foundExpenses = await expenseRepository.findByGroupIdWithPayerAndPayees(group.id);

            const foundExpense = foundExpenses[0];
            expect(foundExpense.description).toEqual("Expense with Payer and Payees");
            expect(foundExpense.payer).toBeDefined();
            expect(foundExpense.payees).toBeDefined();
        });
    });

    describe("removeSingle", () => {
        it("should remove an expense from the database", async () => {
            const expense = await expenseRepository.saveSingle(
                Object.assign(new Expense(), {
                    description: "To Delete",
                    amount: 666
                })
            );

            await expenseRepository.removeSingle(expense);

            const foundExpense = await expenseRepository.findOneByIdWithPayerAndPayees(expense.id);
            expect(foundExpense).toBeNull();
        });
    });

    describe("removeMany", () => {
        it("should remove multiple expenses from the database", async () => {
            const expense1 = new Expense();
            expense1.description = "Test Expense";
            expense1.amount = 1;

            const expense2 = new Expense();
            expense2.description = "Test Expense 2";
            expense2.amount = 2;

            const savedExpenses = await expenseRepository.saveMany([expense1, expense2]);

            await expenseRepository.removeMany(savedExpenses);

            const foundExpense1 = await expenseRepository.findOneByIdWithPayerAndPayees(expense1.id);
            expect(foundExpense1).toBeNull();
            const foundExpense2 = await expenseRepository.findOneByIdWithPayerAndPayees(expense2.id);
            expect(foundExpense2).toBeNull();
        });
    });
});