import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
export declare class DatabasesService implements OnModuleInit {
    private userModel;
    private configService;
    private userService;
    private readonly logger;
    constructor(userModel: SoftDeleteModel<UserDocument>, configService: ConfigService, userService: UsersService);
    onModuleInit(): Promise<void>;
}
