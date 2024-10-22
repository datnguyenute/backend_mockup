import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateNewTransactionDto } from './dto/create-transaction.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { AccountsService } from 'src/accounts/accounts.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: SoftDeleteModel<TransactionDocument>,
    private accountService: AccountsService,
  ) {}

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.transactionModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.transactionModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .exec();

    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }

  async findAllByUser(currentPage: number, limit: number, qs: string, user: IUser) {
    const { filter, sort, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    // Filter by user
    filter.userId = user._id;

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.transactionModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.transactionModel.find(filter).skip(offset).limit(defaultLimit).sort('-updatedAt').exec();

    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }

  async findAllWithQuery(from: string, to: string, qs: string, user: IUser) {
    const { filter, sort, projection } = aqp(qs);
    delete filter.from;
    delete filter.to;

    // Filter by user
    filter.userId = user._id;

    // Filter by date
    filter.updatedAt = {
      $gte: new Date(from),
      $lt: new Date(to),
    };

    const result = await this.transactionModel.find(filter).sort('-updatedAt').exec();

    return result;
  }

  async create(newTransaction: CreateNewTransactionDto, user: IUser) {
    const { amount, date, category, description, type, accountId } = newTransaction;
    const { email, _id } = user;

    // TODO: Check balance

    const newTrans = await this.transactionModel.create({
      userId: _id,
      accountId,
      category,
      type,
      description,
      date,
      amount,
      createdBy: { _id, email },
    });

    // Update account
    const responseUpdate = await this.accountService.updateBalanceByTransaction(newTransaction, user);

    return {
      _id: newTrans?._id,
      createdAt: newTrans?.createdAt,
      responseUpdate,
    };
  }

  async findByUsers(user: IUser) {
    return await this.transactionModel
      .find({
        userId: user._id,
      })
      .sort('-createdAt');
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('not found transactions');
    }

    return await this.transactionModel.findById(id);
  }

  async update(_id: string, date: Date, amount: number, category: string, description: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new BadRequestException('not found account');
    }

    const updated = await this.transactionModel.updateOne(
      { _id },
      {
        date,
        amount,
        category,
        description,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    return updated;
  }

  async remove(id: string, user: IUser) {
    await this.transactionModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.transactionModel.softDelete({
      _id: id,
    });
  }
}
