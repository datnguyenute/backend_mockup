import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateNewTransactionDto, CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import mongoose from 'mongoose';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: SoftDeleteModel<TransactionDocument>,
  ) {}

  async create(newTransaction: CreateNewTransactionDto, user: IUser) {
    const { amount, date } = newTransaction;
    const { email, _id } = user;

    const newTrans = await this.transactionModel.create({
      userId: _id,
      amount: amount,
      date: date,
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

  async update(_id: string, date: Date, amount: number, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new BadRequestException('not found account');
    }

    const updated = await this.transactionModel.updateOne(
      { _id },
      {
        date,
        amount,
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
