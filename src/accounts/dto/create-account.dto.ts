import { IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateAccountDto {
  @IsNotEmpty({ message: 'userId không được để trống' })
  userId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'name không được để trống' })
  name: string;

  @IsNotEmpty({ message: 'balance không được để trống' })
  balance: number;
}

export class CreateNewAccountDto {
  @IsNotEmpty({ message: 'name không được để trống' })
  name: string;

  @IsNotEmpty({ message: 'balance không được để trống' })
  balance: number;
}
