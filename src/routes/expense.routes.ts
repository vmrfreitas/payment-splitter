import * as express from 'express';
import { ExpenseController } from "../controller/expense.controller";
import { container } from 'tsyringe';

const Router = express.Router();
const expenseController = container.resolve(ExpenseController);

Router.get("/:groupId/expenses", expenseController.getAllExpensesFromGroup.bind(expenseController));
Router.post("/:groupId/expenses", expenseController.addOneExpenseToGroup.bind(expenseController));
Router.post("/:groupId/expenses/import", expenseController.importExpensesFromCSV.bind(expenseController));
Router.delete("/:groupId/expenses/:id", expenseController.removeExpenseFromGroup.bind(expenseController));

export { Router as expenseRouter };