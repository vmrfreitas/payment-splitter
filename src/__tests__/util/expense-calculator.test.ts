import { ExpenseCalculator } from '../../util/expense.calculator';
import { Participant } from '../../entity/Participant.entity';

describe('ExpenseCalculator', () => {
  let expenseCalculator: ExpenseCalculator;

  beforeEach(() => {
    expenseCalculator = new ExpenseCalculator();
  });

  describe('calculateSplit', () => {
    it('should handle even splits', () => {
      const result = expenseCalculator.calculateSplit(100, 4);
      expect(result).toEqual({ dividedAmount: 25, remainder: 0 });
    });

    it('should handle uneven splits', () => {
      const result = expenseCalculator.calculateSplit(100, 3);
      expect(result).toEqual({ dividedAmount: 33.33, remainder: 0.01 });
    });
  });

  describe('calculateBalancesOnAdd', () => {
    it('should update balances correctly', () => {
      const payer = { balance: 0 } as Participant;
      const payees = [{ balance: 0 }, { balance: 0 }] as Participant[];
      
      expenseCalculator.calculateBalancesOnAdd(payer, payees, 100, 33.33, 0.01);
      
      expect(payer.balance).toEqual(66.66);
      expect(payees[0].balance).toEqual(-33.33);
      expect(payees[1].balance).toEqual(-33.33);
    });
  });
});