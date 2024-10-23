import mongoose from 'mongoose';
export declare class CreateTransactionDto {
    userId: mongoose.Schema.Types.ObjectId;
    date: Date;
    amount: number;
}
export declare class CreateNewTransactionDto {
    date: Date;
    amount: number;
    category: string;
    type: string;
    description: string;
    accountId: string;
}
