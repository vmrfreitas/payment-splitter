import { AppDataSource } from "../data-source";
import { Expense } from "../entity/Expense.entity";

export const ExpenseRepository = AppDataSource.getRepository(Expense);