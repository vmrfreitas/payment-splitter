import { instance, mock, when } from "ts-mockito";
import { DataSource, Repository } from "typeorm";
import { Expense } from "../entity/Expense.entity";

const mockedDataSource = mock(DataSource);
const mockedExpenseRepo = mock<Repository<Expense>>();

when(mockedDataSource.getRepository(Expense)).thenReturn(instance(mockedExpenseRepo));

jest.mock("@/data-source", () => ({
  AppDataSource: instance(mockedDataSource),
}));