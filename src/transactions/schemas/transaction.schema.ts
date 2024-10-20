import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema({ timestamps: true })
export class Transaction {
  @Prop()
  userId: mongoose.Schema.Types.ObjectId;

  @Prop()
  accountId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop()
  date: Date;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  type: string;

  @Prop()
  description: string;

  @Prop({ type: Object })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  isDeleted: boolean;

  @Prop()
  deletedAt: Date;
}
export const TransactionSchema = SchemaFactory.createForClass(Transaction);
