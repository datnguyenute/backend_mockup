import { Transaction } from "./schemas/transaction.schema";

export interface IAmountValue {
  totalAmount: number;
  totalTransaction: number;
}

// Total amount (income and expense) between from and to
export interface IBalanceFlow {
  income: IAmountValue;
  expense: IAmountValue;
}

export interface IStatistics {
  type: string; // "day", "month", "year"
  data: {
    label: string; // day: "MM-yy", month: Jan|Feb|Mar|Apr|May|June|July|Aug|Sept|Oct|Nov|Dec, year: "YYYY"
    income: IAmountValue;
    expense: IAmountValue;
  }[];
}

export interface IResponseReport {
  balanceFlow: IBalanceFlow;
  statistics: IStatistics;
  transactionHistory: Transaction[]; // Array of the first five transactions
}
