import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { CreateUserSocialDto } from 'src/users/dto/create-user.dto';
import { IUser } from 'src/users/users.interface';
import { UsersService } from 'src/users/users.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    private configService;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService);
    validateUser(username: string, pass: string): Promise<any>;
    login(user: IUser, response: Response): Promise<{
        access_token: string;
        refresh_token: string;
        user: {
            _id: string;
            name: string;
            email: string;
            type: string;
        };
    }>;
    loginSocial(loginSocial: CreateUserSocialDto, response: Response): Promise<{
        access_token: string;
        refresh_token: string;
        user: {
            _id: import("mongoose").Types.ObjectId;
            name: string;
            email: string;
            type: string;
        };
    }>;
    createRefreshToken: (payload: any) => string;
    processNewToken: (refreshToken: string, response: Response) => Promise<{
        access_token: string;
        user: {
            _id: import("mongoose").Types.ObjectId;
            name: string;
            email: string;
            type: string;
        };
    }>;
    logout: (response: Response, user: IUser) => Promise<string>;
}
