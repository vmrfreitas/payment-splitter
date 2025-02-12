import { EmailService } from "../../service/email.service";
import { User } from "../../entity/User.entity";
import { Expense } from "../../entity/Expense.entity";
import { Group } from "../../entity/Group.entity";
import * as nodemailer from "nodemailer";
import { mocked } from 'jest-mock';

jest.mock('nodemailer', () => {
    return {
        createTransport: jest.fn().mockReturnValue({
            sendMail: jest.fn().mockResolvedValue({}),
        }),
    };
});

const mockedCreateTransport = mocked(nodemailer.createTransport);
const mockedSendMail = mocked(mockedCreateTransport({}).sendMail);

describe('EmailService', () => {
    let emailService: EmailService;

    beforeEach(() => {
        emailService = new EmailService();
        mockedSendMail.mockClear();
    });

    describe('sendExpenseNotification', () => {
        it('should send an email to the payer with correct details', async () => {
            const payer = new User();
            payer.email = 'payer@example.com';
            payer.name = 'Payer Name';

            const payee1 = new User();
            payee1.email = 'payee1@example.com';
            payee1.name = 'Payee One';
            const payees = [payee1];

            const group = new Group();
            group.name = 'Test Group';

            const expense = new Expense();
            expense.amount = 100;
            expense.description = 'Test Expense';
            expense.group = group;

            await emailService.sendExpenseNotification(payer, payees, expense, 60, 40);

            expect(mockedSendMail).toHaveBeenCalledTimes(2);

            expect(mockedSendMail).toHaveBeenCalledWith(expect.objectContaining({
                to: payer.email,
                subject: `You paid $100 in Test Group`,
                html: `<p>You paid $100 for "Test Expense". Your share: $60.</p>`,
                from: `Payment Splitter App <paymentsplitterapp@gmail.com>`
            }));

            expect(mockedSendMail).toHaveBeenCalledWith(expect.objectContaining({
                to: payee1.email,
                subject: `You owe $40 in Test Group`,
                html: `<p>Payer Name paid $100 for "Test Expense". Your share: $40.</p>`,
                from: `Payment Splitter App <paymentsplitterapp@gmail.com>`
            }));
        });
    });

    describe('sendSettlementNotification', () => {
        it('should send emails to both payer and payee with correct details', async () => {
            const payer = new User();
            payer.email = 'payer@example.com';
            payer.name = 'Payer Name';

            const payee = new User();
            payee.email = 'payee@example.com';
            payee.name = 'Payee Name';

            const groupName = 'Test Group';
            const amount = 50;

            await emailService.sendSettlementNotification(payer, payee, amount, groupName);

            expect(mockedSendMail).toHaveBeenCalledTimes(2);

            expect(mockedSendMail).toHaveBeenCalledWith(expect.objectContaining({
                to: payer.email,
                subject: `Payment of $50 settled`,
                html: expect.stringContaining(`
      <p>Hi Payer Name,</p>
      <p>You payed $50 to Payee Name in Test Group.</p>
    `),
                from: `Payment Splitter App <paymentsplitterapp@gmail.com>`
            }));

            expect(mockedSendMail).toHaveBeenCalledWith(expect.objectContaining({
                to: payee.email,
                subject: `Payment of $50 settled`,
                html: expect.stringContaining(`
      <p>Hi Payee Name,</p>
      <p>Payer Name has payed you $50 in Test Group.</p>
    `),
                from: `Payment Splitter App <paymentsplitterapp@gmail.com>`
            }));
        });
    });
});