import mongoose, { HydratedDocument } from 'mongoose';
export type AccountDocument = HydratedDocument<Account>;
export declare class Account {
    name: string;
    userId: mongoose.Schema.Types.ObjectId;
    balance: number;
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
export declare const AccountSchema: mongoose.Schema<Account, mongoose.Model<Account, any, any, any, mongoose.Document<unknown, any, Account> & Account & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Account, mongoose.Document<unknown, {}, mongoose.FlatRecord<Account>> & mongoose.FlatRecord<Account> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}>;
