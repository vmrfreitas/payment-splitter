import { injectable } from "tsyringe";
import { Participant } from "../entity/Participant.entity";

@injectable()
export class ExpenseCalculator {
  calculateSplit(totalAmount: number, numberOfParticipants: number): {
    dividedAmount: number;
    remainder: number;
  } {
    const dividedAmount = Number((totalAmount / numberOfParticipants).toFixed(2));
    const remainder = Number((totalAmount - (dividedAmount * numberOfParticipants)).toFixed(2));
    return { dividedAmount, remainder };
  }

  calculateBalancesOnAdd(
    payer: Participant,
    payees: Participant[],
    totalAmount: number,
    dividedAmount: number,
    remainder: number
  ): void {
    const owedToPayer = totalAmount - (dividedAmount + remainder );
    
    payees.forEach(payee => {
      payee.balance = Number((+payee.balance - dividedAmount).toFixed(2));
    });

    payer.balance = Number((+payer.balance + owedToPayer).toFixed(2));
  }

  calculateBalancesOnRemove(
    payer: Participant,
    payees: Participant[],
    totalAmount: number,
    dividedAmount: number,
    remainder: number
  ): void {
    const owedToPayer = totalAmount - (dividedAmount + remainder);
    
    payees.forEach(payee => {
      payee.balance = Number((+payee.balance + dividedAmount).toFixed(2));
    });

    payer.balance = Number((+payer.balance - owedToPayer).toFixed(2));
  }
}