import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import * as csv from "csv-parser";
import { Expense } from "../entity/Expense.entity";
import { Group } from "../entity/Group.entity";
import { Participant } from "../entity/Participant.entity";
import { injectable } from "tsyringe";
import { ExpenseCalculator } from "../util/expense.calculator";

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

@injectable()
export class S3Service {
    constructor(private expenseCalculator: ExpenseCalculator) {}

    async getExpensesFromCSV(key: string, group: Group, participants: Participant[]): Promise<Expense[]> {
        try {
            const command = new GetObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: key,
            });

            const response = await s3Client.send(command);
            const stream = response.Body as Readable;

            return await new Promise((resolve, reject) => {
                const expenses: Expense[] = [];
                stream
                    .pipe(csv())
                    .on("data", (data) => {
                        const expense = new Expense();
                        expense.description = data.description;
                        expense.amount = parseFloat(data.amount);
                        expense.group = group;
                        
                        const payer = participants.find(p => p.userId === data.payerId);
                        const payees = participants.filter(p => data.payeeIds.split(";").includes(p.userId));
                        expense.payer = payer;
                        expense.payees = payees;
                        
                        if (!payer || payees.length === 0) {
                            throw new Error("Invalid participant data in CSV row");
                        }

                        expense.calculationMetadata =  this.expenseCalculator.calculateSplit(
                                expense.amount,
                                payees.length + 1
                            );

                        expenses.push(expense);
                    })
                    .on("end", () => resolve(expenses))
                    .on("error", (error) => reject(error));
            });
        } catch (error) {
            console.error("S3 CSV Fetch Error:", error);
            throw new Error("Failed to fetch expenses from S3");
        }
    }
}