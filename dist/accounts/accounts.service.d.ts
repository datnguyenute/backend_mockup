import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { IUser } from 'src/users/users.interface';
import { Account, AccountDocument } from './schemas/account.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import mongoose from 'mongoose';
import { CreateNewTransactionDto } from 'src/transactions/dto/create-transaction.dto';
export declare class AccountsService {
    private accountModel;
    constructor(accountModel: SoftDeleteModel<AccountDocument>);
    create(createNewAccountDto: CreateAccountDto, user: IUser): Promise<{
        _id: mongoose.Types.ObjectId;
        createdAt: Date;
    }>;
    findOne(id: string): Promise<mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, Account> & Account & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v?: number;
    }> & mongoose.Document<unknown, {}, Account> & Account & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v?: number;
    } & Required<{
        _id: mongoose.Types.ObjectId;
    }>>;
    findByUsers(user: IUser): Promise<(mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, Account> & Account & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v?: number;
    }> & mongoose.Document<unknown, {}, Account> & Account & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v?: number;
    } & Required<{
        _id: mongoose.Types.ObjectId;
    }>)[]>;
    updateAccount(_id: string, balance: number, user: IUser): Promise<mongoose.UpdateWriteOpResult>;
    updateBalanceByTransaction(createNewTransactionDto: CreateNewTransactionDto, user: IUser): Promise<mongoose.UpdateWriteOpResult>;
    update(_id: string, updateAccount: UpdateAccountDto, user: IUser): Promise<mongoose.UpdateWriteOpResult>;
    remove(id: string, user: IUser): Promise<{
        deleted: number;
    }>;
}
