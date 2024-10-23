import mongoose, { HydratedDocument } from 'mongoose';
export type TransactionDocument = HydratedDocument<Transaction>;
export declare class Transaction {
    userId: mongoose.Schema.Types.ObjectId;
    accountId: mongoose.Schema.Types.ObjectId;
    amount: number;
    date: Date;
    category: string;
    type: string;
    description: string;
    createdBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    };
    updatedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    };
    deletedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    };
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
    deletedAt: Date;
}
export declare const TransactionSchema: mongoose.Schema<Transaction, mongoose.Model<Transaction, any, any, any, mongoose.Document<unknown, any, Transaction> & Transaction & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Transaction, mongoose.Document<unknown, {}, mongoose.FlatRecord<Transaction>> & mongoose.FlatRecord<Transaction> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}>;
