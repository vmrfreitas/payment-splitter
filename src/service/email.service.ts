// src/services/email.service.ts
import { User } from "../entity/User.entity";
import { Expense } from "../entity/Expense.entity";
import * as nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "paymentsplitterapp@gmail.com",
        pass: process.env.EMAIL_PASSWORD,
    },
});

export class EmailService {
    static async sendEmail(to: string, subject: string, html: string) {
        try {
            await transporter.sendMail({
                from: `Payment Splitter App <paymentsplitterapp@gmail.com>`,
                to,
                subject,
                html,
            });
            console.log("Email sent to:", to);
        } catch (error) {
            console.error("Email failed:", error);
        }
    }

    static async sendExpenseNotification(
        payer: User,
        payees: User[],
        expense: Expense,
        payerShare: number,
        payeeShare: number
    ) {
        const payerSubject = `You paid $${expense.amount} in ${expense.group.name}`;
        const payerHtml = `<p>You paid $${expense.amount} for "${expense.description}". Your share: $${payerShare}.</p>`;

        await this.sendEmail(payer.email, payerSubject, payerHtml);

        for (const payee of payees) {
            const payeeSubject = `You owe $${payeeShare} in ${expense.group.name}`;
            const payeeHtml = `<p>${payer.name} paid $${expense.amount} for "${expense.description}". Your share: $${payeeShare}.</p>`;
            await this.sendEmail(payee.email, payeeSubject, payeeHtml);
        }
    }

    static async sendSettlementNotification(
        payer: User,
        payee: User,
        amount: number,
        groupName: string
    ) {
        const subject = `Payment of $${amount} settled`;
        const payerHtml = `
      <p>Hi ${payer.name},</p>
      <p>You payed $${amount} to ${payee.name} in ${groupName}.</p>
    `;

        const payeeHtml = `
      <p>Hi ${payee.name},</p>
      <p>${payer.name} has payed you $${amount} in ${groupName}.</p>
    `;
        await this.sendEmail(payer.email, subject, payerHtml);
        await this.sendEmail(payee.email, subject, payeeHtml);
    }
}