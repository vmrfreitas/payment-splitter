import * as express from 'express';
import { ExpenseController } from "../controller/expense.controller";
const router = express.Router();

router.get("/:groupId/expenses", ExpenseController.getAllExpensesFromGroup);
router.post("/:groupId/expenses", ExpenseController.addExpensesToGroup);
router.delete("/:groupId/expenses/:id", ExpenseController.removeExpenseFromGroup);

export { router as ExpensesRouter };