import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class DatabasesService implements OnModuleInit {
  private readonly logger = new Logger(DatabasesService.name);

  constructor(
    @InjectModel(User.name)
    private userModel: SoftDeleteModel<UserDocument>,
    private configService: ConfigService,
    private userService: UsersService,
  ) {}

  async onModuleInit() {
    const isInit = this.configService.get<string>('SHOULD_INIT');
    if (Boolean(isInit)) {
      const countUser = await this.userModel.countDocuments({});
      if (countUser === 0) {
        await this.userModel.insertMany([
          {
            name: "I'm admin",
            email: 'admin@gmail.com',
            password: this.userService.hashPassword(this.configService.get<string>('INIT_PASSWORD')),
          },
          {
            name: 'DatNB4',
            email: 'datnb4@gmail.com',
            password: this.userService.hashPassword(this.configService.get<string>('INIT_PASSWORD')),
          },
          {
            name: "I'm normal user",
            email: 'user@gmail.com',
            password: this.userService.hashPassword(this.configService.get<string>('INIT_PASSWORD')),
          },
        ]);
      }
      if (countUser > 0) {
        this.logger.log('>>> ALREADY INIT SAMPLE DATA...');
      }
    }
  }
}
