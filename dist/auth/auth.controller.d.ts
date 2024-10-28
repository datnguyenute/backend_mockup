import { AuthService } from './auth.service';
import { CreateUserSocialDto, RegisterUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { Request, Response } from 'express';
import { IUser } from 'src/users/users.interface';
export declare class AuthController {
    private authService;
    private userService;
    constructor(authService: AuthService, userService: UsersService);
    login(req: any, response: Response): Promise<{
        access_token: string;
        refresh_token: string;
        user: {
            _id: string;
            name: string;
            email: string;
            type: string;
        };
    }>;
    register(req: RegisterUserDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../users/schemas/user.schema").User> & import("../users/schemas/user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }> & import("mongoose").Document<unknown, {}, import("../users/schemas/user.schema").User> & import("../users/schemas/user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    loginSocial(createUserSocialDto: CreateUserSocialDto, response: Response): Promise<{
        access_token: string;
        refresh_token: string;
        user: {
            _id: import("mongoose").Types.ObjectId;
            name: string;
            email: string;
            type: string;
        };
    }>;
    handleGetAccount(user: IUser): {
        user: IUser;
    };
    handleRefreshToken(request: Request, response: Response): Promise<{
        access_token: string;
        user: {
            _id: import("mongoose").Types.ObjectId;
            name: string;
            email: string;
            type: string;
        };
    }>;
    handleLogout(response: Response, user: IUser): Promise<string>;
}
