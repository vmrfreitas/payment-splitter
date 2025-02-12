import { EmailService } from "../../service/email.service";
import { User } from "../../entity/User.entity";
import { Expense } from "../../entity/Expense.entity";
import * as nodemailer from "nodemailer";

jest.mock("nodemailer");

describe("EmailService", () => {
    let emailService: EmailService;
    let sendMailMock: jest.Mock;

    beforeAll(() => {
        sendMailMock = jest.fn();
        (nodemailer.createTransport as jest.Mock).mockReturnValue({
            sendMail: sendMailMock,
        });
        emailService = new EmailService();
    });

    beforeEach(() => {
        sendMailMock.mockClear();
    });

    describe("sendExpenseNotification", () => {
        it("should send an email to the payer with correct HTML content", async () => {
            const payer = new User();
            payer.email = "payer@example.com";
            payer.name = "Payer Name";

            const payees = [new User(), new User()];
            payees[0].email = "payee1@example.com";
            payees[1].email = "payee2@example.com";

            const expense = new Expense();
            expense.amount = 100;
            expense.description = "Test Expense";
            expense.group = { name: "Test Group" } as any;

            const payerShare = 50;
            const payeeShare = 25;

            await emailService.sendExpenseNotification(payer, payees, expense, payerShare, payeeShare);

            expect(sendMailMock).toHaveBeenCalledWith({
                from: "Payment Splitter App <paymentsplitterapp@gmail.com>",
                to: "payer@example.com",
                subject: "You paid $100 in Test Group",
                html: `<p>You paid $100 for "Test Expense". Your share: $50.</p>`,
            });
        });
    });
});