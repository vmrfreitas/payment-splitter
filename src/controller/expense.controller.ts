import { Request, Response } from 'express';
import { ExpenseService } from '../service/expense.service';
import { S3Service } from '../service/s3.service';
import { injectable } from 'tsyringe';

@injectable()
export class ExpenseController { 
    constructor(private expenseService: ExpenseService, private s3Service: S3Service) {}
    
    async getAllExpensesFromGroup(req: Request, res: Response) {
        const expenses = await this.expenseService.getAllExpensesFromGroup(req.params.groupId);
        res.status(200).json(expenses);
    }

    async importExpensesFromCSV(req: Request, res: Response) {
        try {
          const { key } = req.body;
        
          const expenses = await this.s3Service.getExpensesFromCSV(key, req.params.groupId);
                    
          res.status(200).json({ message: "Expenses imported successfully", expenses });
        } catch (error) {
          res.status(500).json({ error: "Failed to import expenses" });
          console.log(error);
        }
    }

    async addOneExpenseToGroup(req: Request, res: Response) {
        const { description, amount, payerId, payeeIds } = req.body; 
        const expense = await this.expenseService.addOneExpenseToGroup(req.params.groupId, description, amount, payerId, payeeIds);         
        res.status(201).json({ message: "Expenses added successfully", expense }); 
    }

    async removeExpenseFromGroup(req: Request, res: Response) {
        this.expenseService.removeExpenseFromGroup(req.params.id);
        res.status(200).json({ message: "Expense removed successfully" });
    }
}