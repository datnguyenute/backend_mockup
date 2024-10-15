import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { IUser } from 'src/users/users.interface';
import { ResponseMessage, User } from 'src/decorator/customize';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @ResponseMessage('Create a new account')
  create(@Body() createNewAccountDto: CreateAccountDto, @User() user: IUser) {
    return this.accountsService.create(createNewAccountDto, user);
  }

  @Get('by-user')
  @ResponseMessage('Get account by User')
  getResumesByUser(@User() user: IUser) {
    return this.accountsService.findByUsers(user);
  }

  @Get(':id')
  @ResponseMessage('Fetch a account by id')
  findOne(@Param('id') id: string) {
    return this.accountsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Update balance account')
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto, @User() user: IUser) {
    return this.accountsService.update(id, updateAccountDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete a resume by id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.accountsService.remove(id, user);
  }
}
