import { Request, Response } from 'express';
import { ExpenseService } from '../service/expense.service';

export class ExpenseController { 
    static async getAllExpensesFromGroup(req: Request, res: Response) {
        const expenses = await ExpenseService.getAllExpensesFromGroup(req.params.groupId);
        res.status(200).json(expenses);
    }

    static async addOneExpenseToGroup(req: Request, res: Response) {
        const { description, amount, payerId, payeesIds } = req.body; 
        const expenses = await ExpenseService.addOneExpenseToGroup(req.params.groupId, description, amount, payerId, payeesIds);         
        res.status(201).json({ message: "Expenses added successfully", expenses }); 
    }

    static async removeExpenseFromGroup(req: Request, res: Response) {
        ExpenseService.removeExpenseFromGroup(req.params.groupId, req.params.id);
        res.status(200).json({ message: "Expense removed successfully" });
    }
}