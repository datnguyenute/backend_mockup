import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateNewTransactionDto, CreateTransactionDto } from './dto/create-transaction.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @ResponseMessage('Create a new transaction')
  create(@Body() createNewTransactionDto: CreateNewTransactionDto, @User() user: IUser) {
    return this.transactionsService.create(createNewTransactionDto, user);
  }

  @Get('by-user')
  @ResponseMessage('Get transaction by User')
  getResumesByUser(@User() user: IUser) {
    return this.transactionsService.findByUsers(user);
  }

  @Get(':id')
  @ResponseMessage('Fetch a transaction by id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Update balance transaction')
  update(@Param('id') id: string, @Body('date') date: Date, @Body('amount') amount: number, @User() user: IUser) {
    return this.transactionsService.update(id, date, amount, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete a resume by id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.transactionsService.remove(id, user);
  }
}
