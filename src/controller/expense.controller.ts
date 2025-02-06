import { Request, Response } from 'express';
import { ExpenseService } from '../service/Expense.service';

export class ExpenseController { 
    static async getAllExpenses(req: Request, res: Response) {
        const expenses = await ExpenseService.findExpenses(req.params.groupId);
        res.status(200).json(expenses);
    }

    static async addExpenses(req: Request, res: Response) {
        const expenses = await ExpenseService.addExpenses(req.params.groupId, req.body.userIds);         
        res.status(201).json({ message: "Expenses added successfully", expenses }); 
    }

    static async removeExpense(req: Request, res: Response) {
        ExpenseService.removeExpense(req.params.groupId, req.params.userId);
        res.status(200).json({ message: "Expense removed successfully" });
    }
}