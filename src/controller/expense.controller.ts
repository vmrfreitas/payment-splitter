import { Request, Response } from 'express';
import { ExpenseService } from '../service/expense.service';
import { S3Service } from '../service/s3.service';
import { ExpenseRepository } from '../repositories/expense.repository';

export class ExpenseController { 
    static async getAllExpensesFromGroup(req: Request, res: Response) {
        const expenses = await ExpenseService.getAllExpensesFromGroup(req.params.groupId);
        res.status(200).json(expenses);
    }

    static async importExpensesFromCSV(req: Request, res: Response) {
        try {
          const { key } = req.body;
        
          const expenses = await S3Service.getExpensesFromCSV(key, req.params.groupId);
                    
          res.status(200).json({ message: "Expenses imported successfully", expenses });
        } catch (error) {
          res.status(500).json({ error: "Failed to import expenses" });
          console.log(error);
        }
    }

    static async addOneExpenseToGroup(req: Request, res: Response) {
        const { description, amount, payerId, payeeIds } = req.body; 
        const expense = await ExpenseService.addOneExpenseToGroup(req.params.groupId, description, amount, payerId, payeeIds);         
        res.status(201).json({ message: "Expenses added successfully", expense }); 
    }

    static async removeExpenseFromGroup(req: Request, res: Response) {
        ExpenseService.removeExpenseFromGroup(req.params.groupId, req.params.id);
        res.status(200).json({ message: "Expense removed successfully" });
    }
}