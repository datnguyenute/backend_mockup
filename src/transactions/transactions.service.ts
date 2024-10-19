import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateNewTransactionDto, CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: SoftDeleteModel<TransactionDocument>,
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

  async create(newTransaction: CreateNewTransactionDto, user: IUser) {
    const { amount, date, category, description, type } = newTransaction;
    const { email, _id } = user;

    const newTrans = await this.transactionModel.create({
      userId: _id,
      category,
      type,
      description,
      date,
      amount,
      createdBy: { _id, email },
    });

    return {
      _id: newTrans?._id,
      createdAt: newTrans?.createdAt,
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
