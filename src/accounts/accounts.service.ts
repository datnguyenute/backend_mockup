import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Account, AccountDocument } from './schemas/account.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import mongoose from 'mongoose';

@Injectable()
export class AccountsService {
  constructor(
    @InjectModel(Account.name)
    private accountModel: SoftDeleteModel<AccountDocument>,
  ) {}

  async create(createNewAccountDto: CreateAccountDto, user: IUser) {
    const { balance, name } = createNewAccountDto;
    const { email, _id } = user;

    const newAccount = await this.accountModel.create({
      userId: _id,
      name: name,
      balance: balance,
      createdBy: { _id, email },
    });

    return {
      _id: newAccount?._id,
      createdAt: newAccount?.createdAt,
    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('not found account');
    }

    return await this.accountModel.findById(id);
  }

  async findByUsers(user: IUser) {
    return await this.accountModel
      .find({
        userId: user._id,
      })
      .sort('-createdAt');
  }

  async update(_id: string, updateAccount: UpdateAccountDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new BadRequestException('not found account');
    }

    const { balance, name } = updateAccount;

    const updated = await this.accountModel.updateOne(
      { _id },
      {
        balance,
        name,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    return updated;
  }

  async remove(id: string, user: IUser) {
    await this.accountModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.accountModel.softDelete({
      _id: id,
    });
  }
}
