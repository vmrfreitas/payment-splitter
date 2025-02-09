// src/services/s3.service.ts
import { S3Client, GetObjectCommand, ListBucketsCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import * as csv from "csv-parser";
import { Expense } from "../entity/Expense.entity";
import { GroupRepository } from "../repositories/group.repository";
import { ExpenseRepository } from "../repositories/expense.repository";
import { ParticipantRepository } from "../repositories/participant.repository";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export class S3Service {
  static async getExpensesFromCSV(key: string, groupId: string): Promise<Expense[]> {
    const group = await GroupRepository.findOne({ relations: ["participants", "expenses"], where: { id: groupId } });
    const groupParticipants = group.participants;

    try {
      const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
      });

      const response = await s3Client.send(command);
      const stream = response.Body as Readable;

      const expenses: Expense[] = await new Promise((resolve, reject) => {
        const expenses: Expense[] = [];
        stream
          .pipe(csv())
          .on("data", (data) => {
            const expense = new Expense();
            expense.description = data.description;
            expense.amount = parseFloat(data.amount);
            expense.group = group;
            expense.payer = groupParticipants.find((participant) => participant.userId === data.payerId);
            const payeeIds = data.payeeIds.split(";");
            expense.payees = groupParticipants.filter((participant) => payeeIds.includes(participant.userId));

            const payerShare = 1;
            const dividedAmount: number = Math.floor(expense.amount/(expense.payees.length + payerShare)*100)/100;
            const remainder = +expense.amount - dividedAmount * (expense.payees.length + payerShare);
            for (const payee of expense.payees ){
                payee.balance = Math.round((+payee.balance - dividedAmount)*100)/100;
            }
            expense.payer.balance = Math.round((+expense.payer.balance + +expense.amount - (dividedAmount + remainder))*100)/100;
    

            expenses.push(expense);
          })
          .on("end", () => resolve(expenses))
          .on("error", (error) => reject(error));
      });
      await ParticipantRepository.save(groupParticipants);
      return await ExpenseRepository.save(expenses); //this will have to go to the expense service, which will use the s3 service to get the expenses
    } catch (error) {
      console.error("S3 CSV Fetch Error:", error);
      throw new Error("Failed to fetch expenses from S3");
    }
  }
}