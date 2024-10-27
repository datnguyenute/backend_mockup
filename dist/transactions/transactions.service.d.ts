import { CreateNewTransactionDto } from './dto/create-transaction.dto';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import mongoose from 'mongoose';
import { AccountsService } from 'src/accounts/accounts.service';
import { IResponseReport } from './transactions.interface';
export declare class TransactionsService {
    private transactionModel;
    private accountService;
    constructor(transactionModel: SoftDeleteModel<TransactionDocument>, accountService: AccountsService);
    findAll(currentPage: number, limit: number, qs: string): Promise<{
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        };
        result: (mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, Transaction> & Transaction & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v?: number;
        }> & mongoose.Document<unknown, {}, Transaction> & Transaction & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v?: number;
        } & Required<{
            _id: mongoose.Types.ObjectId;
        }>)[];
    }>;
    findAllByUser(currentPage: number, limit: number, qs: string, user: IUser): Promise<{
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        };
        result: (mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, Transaction> & Transaction & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v?: number;
        }> & mongoose.Document<unknown, {}, Transaction> & Transaction & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v?: number;
        } & Required<{
            _id: mongoose.Types.ObjectId;
        }>)[];
    }>;
    findAllWithQuery(from: string, to: string, qs: string, user: IUser): Promise<(mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, Transaction> & Transaction & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v?: number;
    }> & mongoose.Document<unknown, {}, Transaction> & Transaction & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v?: number;
    } & Required<{
        _id: mongoose.Types.ObjectId;
    }>)[]>;
    private formatLabel;
    findAllForReport(from: string, to: string, type: number, asset: string, user: IUser): Promise<IResponseReport>;
    create(newTransaction: CreateNewTransactionDto, user: IUser): Promise<{
        _id: mongoose.Types.ObjectId;
        createdAt: Date;
        responseUpdate: mongoose.UpdateWriteOpResult;
    }>;
    findByUsers(user: IUser): Promise<(mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, Transaction> & Transaction & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v?: number;
    }> & mongoose.Document<unknown, {}, Transaction> & Transaction & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v?: number;
    } & Required<{
        _id: mongoose.Types.ObjectId;
    }>)[]>;
    findOne(id: string): Promise<mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, Transaction> & Transaction & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v?: number;
    }> & mongoose.Document<unknown, {}, Transaction> & Transaction & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v?: number;
    } & Required<{
        _id: mongoose.Types.ObjectId;
    }>>;
    update(_id: string, date: Date, amount: number, category: string, description: string, user: IUser): Promise<mongoose.UpdateWriteOpResult>;
    remove(id: string, user: IUser): Promise<{
        deleted: number;
    }>;
}
