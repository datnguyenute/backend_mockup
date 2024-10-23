import { Transaction } from "./schemas/transaction.schema";
export interface IAmountValue {
    totalAmount: number;
    totalTransaction: number;
}
export interface IBalanceFlow {
    income: IAmountValue;
    expense: IAmountValue;
}
export interface IStatistics {
    type: string;
    data: {
        label: string;
        income: IAmountValue;
        expense: IAmountValue;
    }[];
}
export interface IResponseReport {
    balanceFlow: IBalanceFlow;
    statistics: IStatistics;
    transactionHistory: Transaction[];
}
