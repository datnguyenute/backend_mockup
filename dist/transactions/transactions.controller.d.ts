import { TransactionsService } from './transactions.service';
import { CreateNewTransactionDto } from './dto/create-transaction.dto';
import { IUser } from 'src/users/users.interface';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    findAll(currentPage: string, limit: string, qs: string): Promise<{
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        };
        result: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/transaction.schema").Transaction> & import("./schemas/transaction.schema").Transaction & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v?: number;
        }> & import("mongoose").Document<unknown, {}, import("./schemas/transaction.schema").Transaction> & import("./schemas/transaction.schema").Transaction & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v?: number;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>)[];
    }>;
    create(createNewTransactionDto: CreateNewTransactionDto, user: IUser): Promise<{
        _id: import("mongoose").Types.ObjectId;
        createdAt: Date;
        responseUpdate: import("mongoose").UpdateWriteOpResult;
    }>;
    findAllByUser(currentPage: string, limit: string, qs: string, user: IUser): Promise<{
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        };
        result: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/transaction.schema").Transaction> & import("./schemas/transaction.schema").Transaction & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v?: number;
        }> & import("mongoose").Document<unknown, {}, import("./schemas/transaction.schema").Transaction> & import("./schemas/transaction.schema").Transaction & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v?: number;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>)[];
    }>;
    findAllWithQuery(from: string, to: string, qs: string, user: IUser): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/transaction.schema").Transaction> & import("./schemas/transaction.schema").Transaction & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }> & import("mongoose").Document<unknown, {}, import("./schemas/transaction.schema").Transaction> & import("./schemas/transaction.schema").Transaction & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    findAllForReport(from: string, to: string, type: number, user: IUser): Promise<import("./transactions.interface").IResponseReport>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/transaction.schema").Transaction> & import("./schemas/transaction.schema").Transaction & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }> & import("mongoose").Document<unknown, {}, import("./schemas/transaction.schema").Transaction> & import("./schemas/transaction.schema").Transaction & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    update(id: string, date: Date, amount: number, category: string, description: string, user: IUser): Promise<import("mongoose").UpdateWriteOpResult>;
    remove(id: string, user: IUser): Promise<{
        deleted: number;
    }>;
}
