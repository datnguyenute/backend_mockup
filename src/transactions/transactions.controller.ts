import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateNewTransactionDto, CreateTransactionDto } from './dto/create-transaction.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @ResponseMessage('Fetch all transactions')
  findAll(@Query('current') currentPage: string, @Query('pageSize') limit: string, @Query() qs: string) {
    return this.transactionsService.findAll(+currentPage, +limit, qs);
  }

  @Post()
  @ResponseMessage('Create a new transaction')
  create(@Body() createNewTransactionDto: CreateNewTransactionDto, @User() user: IUser) {
    return this.transactionsService.create(createNewTransactionDto, user);
  }

  @Get('by-user')
  @ResponseMessage('Get transaction by User')
  findAllByUser(@Query('current') currentPage: string, @Query('pageSize') limit: string, @Query() qs: string, @User() user: IUser) {
    return this.transactionsService.findAllByUser(+currentPage, +limit, qs, user);
  }

  @Get(':id')
  @ResponseMessage('Fetch a transaction by id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Update balance transaction')
  update(
    @Param('id') id: string,
    @Body('date') date: Date,
    @Body('amount') amount: number,
    @Body('category') category: string,
    @Body('description') description: string,
    @User() user: IUser,
  ) {
    return this.transactionsService.update(id, date, amount, category, description, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete a transaction by id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.transactionsService.remove(id, user);
  }
}
