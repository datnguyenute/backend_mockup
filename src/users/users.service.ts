import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, CreateUserSocialDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>) {}

  async create(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;
    // Check email exist

    //add logic check email
    const isExist = await this.userModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException(`Email: ${email} đã tồn tại trên hệ thống. Vui lòng sử dụng email khác.`);
    }

    // Hash password
    const passwordHash = this.hashPassword(password);
    const createdUser = await this.userModel.create({
      name: name,
      email: email,
      password: passwordHash,
    });
    return createdUser;
  }

  async createUserSocial(createUserSocialDto: CreateUserSocialDto) {
    const { name, email, type } = createUserSocialDto;

    // Hash password
    const createdUser = await this.userModel.create({
      name: name,
      email: email,
      type: type,
    });
    return createdUser;
  }

  async register(registerUserDto: RegisterUserDto) {
    const { name, email, password } = registerUserDto;
    // Check email registerUserDto

    //add logic check email
    const isExist = await this.userModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException(`Email: ${email} đã tồn tại trên hệ thống. Vui lòng sử dụng email khác.`);
    }

    // Hash password
    const passwordHash = this.hashPassword(registerUserDto.password);
    const createdUser = await this.userModel.create({
      name: registerUserDto.name,
      email: registerUserDto.email,
      password: passwordHash,
    });
    return createdUser;
  }

  updateUserToken = async (refreshToken: string, _id: string) => {
    return await this.userModel.updateOne({ _id }, { refreshToken });
  };

  findUserByToken = async (refreshToken: string) => {
    return await this.userModel.findOne({ refreshToken });
  };

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
    if (!mongoose.Types.ObjectId.isValid(id)) return `not found user`;

    return this.userModel.softDelete({
      _id: id,
    });
  }

  hashPassword = (password: string): string => {
    var salt = genSaltSync(10);
    return hashSync(password, salt);
  };
}
