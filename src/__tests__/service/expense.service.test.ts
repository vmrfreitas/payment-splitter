import { ExpenseService } from "../../service/expense.service";
import { UserRepository } from "../../repository/user.repository";
import { EmailService } from "../../service/email.service";
import { ParticipantRepository } from "../../repository/participant.repository";
import { ExpenseRepository } from "../../repository/expense.repository";
import { GroupRepository } from "../../repository/group.repository";
import { ExpenseCalculator } from "../../util/expense.calculator";
import { S3Service } from "../../service/s3.service";
import { Expense } from "../../entity/Expense.entity";
import { Group } from "../../entity/Group.entity";
import { Participant } from "../../entity/Participant.entity";
import { User } from "../../entity/User.entity";
import { mock, MockProxy } from 'jest-mock-extended';

describe('ExpenseService', () => {
    let expenseService: ExpenseService;
    let userRepositoryMock: MockProxy<UserRepository>;
    let emailServiceMock: MockProxy<EmailService>;
    let participantRepositoryMock: MockProxy<ParticipantRepository>;
    let expenseRepositoryMock: MockProxy<ExpenseRepository>;
    let groupRepositoryMock: MockProxy<GroupRepository>;
    let expenseCalculatorMock: MockProxy<ExpenseCalculator>;
    let s3ServiceMock: MockProxy<S3Service>;

    beforeEach(() => {
        userRepositoryMock = mock<UserRepository>();
        emailServiceMock = mock<EmailService>();
        participantRepositoryMock = mock<ParticipantRepository>();
        expenseRepositoryMock = mock<ExpenseRepository>();
        groupRepositoryMock = mock<GroupRepository>();
        expenseCalculatorMock = mock<ExpenseCalculator>();
        s3ServiceMock = mock<S3Service>();

        expenseService = new ExpenseService(
            userRepositoryMock,
            emailServiceMock,
            participantRepositoryMock,
            expenseRepositoryMock,
            groupRepositoryMock,
            expenseCalculatorMock,
            s3ServiceMock,
        );
    });

    describe('addOneExpenseToGroup', () => {
        it('should add an expense to a group and update balances for all participants when no specific payees are provided', async () => {
            const payer = new User();
            payer.id = "payerId";
            const payee1 = new User();
            payee1.id = "payee1Id";
            const payee2 = new User();
            payee2.id = "payee2Id";
            const group = new Group();
            group.id = "groupId";
            const participantPayer = new Participant();
            participantPayer.groupId = group.id;
            participantPayer.userId = payer.id;
            const participantPayee1 = new Participant();
            participantPayee1.groupId = group.id;
            participantPayee1.userId = payee1.id;
            const participantPayee2 = new Participant();
            participantPayee2.groupId = group.id;
            participantPayee2.userId = payee2.id;
            group.participants = [participantPayer, participantPayee1, participantPayee2];

            groupRepositoryMock.findByIdWithExpensesAndParticipants.mockResolvedValue(group);
            expenseCalculatorMock.calculateSplit.mockReturnValue({ dividedAmount: 10, remainder: 0 });
            userRepositoryMock.findById.mockResolvedValue(payer);
            userRepositoryMock.findByIds.mockResolvedValue([ payee1, payee2 ]);
            expenseRepositoryMock.saveSingle.mockResolvedValue({ id: 'expense-id' } as Expense);

            const expense = await expenseService.addOneExpenseToGroup(group.id, "Test expense", 30, payer.id, [payee1.id, payee2.id]);

            expect(groupRepositoryMock.findByIdWithExpensesAndParticipants).toHaveBeenCalledWith(group.id);
            expect(expenseCalculatorMock.calculateSplit).toHaveBeenCalledWith(30, 3);
            expect(expenseCalculatorMock.calculateBalancesOnAdd).toHaveBeenCalled();
            expect(userRepositoryMock.findById).toHaveBeenCalledWith(payer.id);
            expect(userRepositoryMock.findByIds).toHaveBeenCalledWith([payee1.id, payee2.id]);
            expect(emailServiceMock.sendExpenseNotification).toHaveBeenCalled();
            expect(participantRepositoryMock.saveMany).toHaveBeenCalled();
            expect(expenseRepositoryMock.saveSingle).toHaveBeenCalled();
            expect(expense).toBeDefined();
        });

        it('should add an expense to a group and update balances for all participants', async () => {
            const payer = new User();
            payer.id = "payerId";
            const payee1 = new User();
            payee1.id = "payee1Id";
            const payee2 = new User();
            payee2.id = "payee2Id";
            const group = new Group();
            group.id = "groupId";
            const participantPayer = new Participant();
            participantPayer.groupId = group.id;
            participantPayer.userId = payer.id;
            const participantPayee1 = new Participant();
            participantPayee1.groupId = group.id;
            participantPayee1.userId = payee1.id;
            const participantPayee2 = new Participant();
            participantPayee2.groupId = group.id;
            participantPayee2.userId = payee2.id;
            group.participants = [participantPayer, participantPayee1, participantPayee2];

            groupRepositoryMock.findByIdWithExpensesAndParticipants.mockResolvedValue(group);
            expenseCalculatorMock.calculateSplit.mockReturnValue({ dividedAmount: 15, remainder: 0 });
            userRepositoryMock.findById.mockResolvedValue(payer);
            userRepositoryMock.findByIds.mockResolvedValue([ payee1, payee2 ]);
            expenseRepositoryMock.saveSingle.mockResolvedValue({ id: 'expense-id' } as Expense);

            const expense = await expenseService.addOneExpenseToGroup(group.id, "Test expense", 30, payer.id, [payee1.id]);

            expect(groupRepositoryMock.findByIdWithExpensesAndParticipants).toHaveBeenCalledWith(group.id);
            expect(expenseCalculatorMock.calculateSplit).toHaveBeenCalledWith(30, 2);
            expect(expenseCalculatorMock.calculateBalancesOnAdd).toHaveBeenCalled();
            expect(userRepositoryMock.findById).toHaveBeenCalledWith(payer.id);
            expect(userRepositoryMock.findByIds).toHaveBeenCalledWith([payee1.id]);
            expect(emailServiceMock.sendExpenseNotification).toHaveBeenCalled();
            expect(participantRepositoryMock.saveMany).toHaveBeenCalled();
            expect(expenseRepositoryMock.saveSingle).toHaveBeenCalled();
            expect(expense).toBeDefined();
        });
    });

    describe('importExpensesFromS3', () => {
        it('should import raw expenses, call balance calculator and save them', async () => {
            const payer = new User();
            payer.id = "payerId";
            const payee1 = new User();
            payee1.id = "payee1Id";
            const payee2 = new User();
            payee2.id = "payee2Id";
            const group = new Group();
            group.id = "groupId";
            const participantPayer = new Participant();
            participantPayer.groupId = group.id;
            participantPayer.userId = payer.id;
            const participantPayee1 = new Participant();
            participantPayee1.groupId = group.id;
            participantPayee1.userId = payee1.id;
            const participantPayee2 = new Participant();
            participantPayee2.groupId = group.id;
            participantPayee2.userId = payee2.id;
            group.participants = [participantPayer, participantPayee1, participantPayee2];

            s3ServiceMock.getExpensesFromCSV.mockResolvedValue([{
                payer: participantPayer,
                payees: [participantPayee1, participantPayee2],
                amount: 20,
                calculationMetadata: {
                    dividedAmount: 10,
                    remainder: 0 
                }
            },
            {
                payer: participantPayer,
                payees: [participantPayee1, participantPayee2],
                amount: 50,
                calculationMetadata: {
                    dividedAmount: 25,
                    remainder: 0 
                }
            }] as Expense[]);
            groupRepositoryMock.findByIdWithParticipants.mockResolvedValue(group);


            const expenses = await expenseService.importExpensesFromS3("key", "groupId");

            expect(expenseCalculatorMock.calculateBalancesOnAdd).toHaveBeenCalledTimes(2);
            expect(expenseRepositoryMock.saveMany).toHaveBeenCalledWith(expenses);
            expect(participantRepositoryMock.saveMany).toHaveBeenCalledWith([participantPayer, participantPayee1, participantPayee2]);
            expect(expenses).toBeDefined();
        });
    });

    
    describe('getAllExpensesFromGroup', () => {
        it('should return all expenses in a group', async () => {
            const expense = new Expense();
            expense.description = "expense";
            const group = new Group();
            group.expenses = [expense];
            group.id = "groupId";

            groupRepositoryMock.findByIdWithExpenses.mockResolvedValue(group);

            const expenses = await expenseService.getAllExpensesFromGroup("groupId");
            expect(expenses).toStrictEqual([expense]);            
        });
    });

    describe('removeExpenseFromGroup', () => {
        it('should remove an expense and revert participant balances', async () => {
            const payer = new Participant();
            payer.userId = "payerId";
            payer.balance = 50;
            const payee1 = new Participant();
            payee1.userId = "payee1Id";
            payee1.balance = -25;
            const payee2 = new Participant();
            payee2.userId = "payee2Id";
            payee2.balance = -25;
    
            const expense = {
                id: "expense-1",
                amount: 50,
                payer,
                payees: [payee1, payee2],
                group: new Group()
            } as Expense;
    
            expenseRepositoryMock.findOneByIdWithPayerAndPayees.mockResolvedValue(expense);
            expenseCalculatorMock.calculateSplit.mockReturnValue({ 
                dividedAmount: 25, 
                remainder: 0 
            });
    
            await expenseService.removeExpenseFromGroup("expense-1");
    
            expect(expenseRepositoryMock.findOneByIdWithPayerAndPayees).toHaveBeenCalledWith("expense-1");
            expect(expenseCalculatorMock.calculateSplit).toHaveBeenCalledWith(50, 3);
            expect(expenseCalculatorMock.calculateBalancesOnRemove).toHaveBeenCalledWith(
                payer,
                [payee1, payee2],
                50,
                25,
                0
            );
            expect(participantRepositoryMock.saveMany).toHaveBeenCalledWith([payee1, payee2, payer]);
            expect(expenseRepositoryMock.removeSingle).toHaveBeenCalledWith(expense);
        });
    });
});