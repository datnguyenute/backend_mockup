import { IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateTransactionDto {
  @IsNotEmpty({ message: 'userId không được để trống' })
  userId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'date không được để trống' })
  date: Date;

  @IsNotEmpty({ message: 'amount không được để trống' })
  amount: number;
}

export class CreateNewTransactionDto {
  @IsNotEmpty({ message: 'date không được để trống' })
  date: Date;

  @IsNotEmpty({ message: 'amount không được để trống' })
  amount: number;
}
