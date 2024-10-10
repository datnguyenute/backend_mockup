import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    // Hash password
    const passwordHash = this.hashPassword(createUserDto.password);
    const createdUser = await this.userModel.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: passwordHash,
    });
    return createdUser;
  }

  findAll() {
    return this.userModel.find().exec();
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return `not found user`;

    return this.userModel.find({
      _id: id,
    });
  }

  findOneByUsername(email: string) {
    return this.userModel.findOne({
      email: email,
    });
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }

  hashPassword = (password: string): string => {
    var salt = genSaltSync(10);
    return hashSync(password, salt);
  };
}
