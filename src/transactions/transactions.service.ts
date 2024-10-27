import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateNewTransactionDto } from './dto/create-transaction.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { AccountsService } from 'src/accounts/accounts.service';
import dayjs, { UnitTypeLong } from 'dayjs';
import { IAmountValue, IResponseReport, IStatistics } from './transactions.interface';

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
    filter.date = {
      $gte: new Date(from),
      $lt: new Date(to),
    };

    const result = await this.transactionModel.find(filter).sort('-updatedAt').exec();

    return result;
  }

  // Helper method to format the date label based on the stats type
  private formatLabel(date: Date, type: string): string {
    if (type === 'year') {
      return dayjs(date).format('YYYY');
    } else if (type === 'month') {
      return dayjs(date).format('MMM');
    } else {
      return dayjs(date).format('MM/DD');
    }
  }

  /**
   *
   * @param from (can empty) Date from. Ex: 2024-05-09
   * @param to (can empty) Date to. Ex: 2024-05-09
   * @param type (can empty) : 0 - one month ago (30 days ago), 1 - 6 months ago (6 month, 182 days ago), 2 - 1 year ago (12 month, 365 days ago), otherwise - custom
   * Custom (if type empty or not [0, 1, 2], will handle with from and to)
   *  <= 30 day: day
   *  <= 1 years (365 days): month
   *  > 1 year: year
   * @param qs (can empty)  query string
   * @param user current user
   * @returns ResponseReport
   */
  async findAllForReport(from: string, to: string, type: number, asset: string, user: IUser) {
    let startDate: Date;
    let endDate: Date = new Date();

    // Handling date ranges based on 'type'
    switch (type) {
      case 0: // One month ago (30 days ago)
        startDate = dayjs().subtract(30, 'day').toDate();
        break;
      case 1: // Six months ago (~ 182 days ago)
        startDate = dayjs().subtract(6, 'month').toDate();
        break;
      case 2: // One year ago (365 days ago)
        startDate = dayjs().subtract(1, 'year').add(1, 'day').toDate();
        break;
      default: // Custom date range
        startDate = from ? new Date(from) : dayjs().subtract(30, 'day').toDate();
        endDate = to ? new Date(to) : endDate;
    }

    // Calculate the difference in days between the two dates
    const diffInDays = dayjs(endDate).diff(dayjs(startDate), 'day');
    let statsType: UnitTypeLong = 'day'; // Default to 'day'
    if (diffInDays > 365) {
      statsType = 'year';
    } else if (diffInDays > 30) {
      statsType = 'month';
    }

    // Generate the labels (arrLabel) based on the statsType
    const arrLabel: string[] = [];
    let currentDate = dayjs(startDate);

    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, statsType)) {
      arrLabel.push(this.formatLabel(currentDate.toDate(), statsType));
      currentDate = currentDate.add(1, statsType); // Increment by the determined type (day, month, or year)
    }

    // Construct the query filter
    const filter = {
      userId: user._id,
      date: { $gte: startDate, $lte: endDate },
      accountId: asset,
    };

    // Query with asset
    if (asset === '') {
      delete filter.accountId;
    }

    // Fetch all transactions
    const transactions = await this.transactionModel.find(filter).exec();

    // Get the first 5 transactions
    const transactionHistory = transactions.slice(0, 5);

    // Process transactions to calculate balance flow
    let income: IAmountValue = { totalAmount: 0, totalTransaction: 0 };
    let expense: IAmountValue = { totalAmount: 0, totalTransaction: 0 };

    transactions.forEach((transaction) => {
      if (transaction.type === 'Income') {
        income.totalAmount += transaction.amount;
        income.totalTransaction += 1;
      } else if (transaction.type === 'Expense') {
        expense.totalAmount += transaction.amount;
        expense.totalTransaction += 1;
      }
    });

    // Group transactions by the labels from arrLabel
    const groupedData = new Map<string, { income: IAmountValue; expense: IAmountValue }>();

    arrLabel.forEach((label) => {
      groupedData.set(label, {
        income: { totalAmount: 0, totalTransaction: 0 },
        expense: { totalAmount: 0, totalTransaction: 0 },
      });
    });

    // Populate grouped data with transaction amounts
    transactions.forEach((transaction) => {
      const label = this.formatLabel(transaction.date, statsType);
      const data = groupedData.get(label);

      if (transaction.type === 'Income') {
        data.income.totalAmount += transaction.amount;
        data.income.totalTransaction += 1;
      } else if (transaction.type === 'Expense') {
        data.expense.totalAmount += transaction.amount;
        data.expense.totalTransaction += 1;
      }

      groupedData.set(label, data);
    });

    // Convert grouped data to an array and ensure descending order
    const statisticsData = Array.from(groupedData.entries())
      .sort((a, b) => dayjs(b[0]).toDate().getTime() - dayjs(a[0]).toDate().getTime()) // Sort by date descending
      .map(([label, value]) => ({
        label,
        income: value.income,
        expense: value.expense,
      }));

    // Create statistics
    const statistics: IStatistics = {
      type: statsType,
      data: statisticsData,
    };

    // transaction

    // Create the response report
    const response: IResponseReport = {
      balanceFlow: { income, expense },
      statistics,
      transactionHistory,
    };

    return response;
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
