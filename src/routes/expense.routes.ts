import * as express from 'express';
import { ExpenseController } from "../controller/expense.controller";
const router = express.Router();

router.get("/:groupId/expenses", ExpenseController.getAllExpenses);
router.post("/:groupId/expenses", ExpenseController.addExpenses);
router.delete("/:groupId/expenses/:id", ExpenseController.removeExpense);

export { router as ExpensesRouter };