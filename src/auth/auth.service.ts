import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { response, Response } from 'express';
import ms from 'ms';
import { CreateUserSocialDto } from 'src/users/dto/create-user.dto';
import { IUser } from 'src/users/users.interface';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    // Check password
    if (user) {
      const isValid = await this.usersService.isValidPassword(pass, user.password);
      if (isValid) {
        return user;
      }
    }
    return null;
  }

  async login(user: IUser, response: Response) {
    const { _id, email, name, type } = user;
    const payload = {
      sub: 'token login',
      iss: 'from server',
      _id,
      name,
      email,
    };

    const refreshToken = this.createRefreshToken(payload);

    // Update user with token
    await this.usersService.updateUserToken(refreshToken, _id);

    // Set refresh token to cookie

    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: ms(this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRE')),
    });

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: refreshToken,
      user: {
        _id,
        name,
        email,
        type,
      },
    };
  }

  async loginSocial(loginSocial: CreateUserSocialDto, response: Response) {
    const typeSocial = loginSocial.type;
    const emailSocial = loginSocial.email;

    // Check exist email
    let user = await this.usersService.findOneByUsername(emailSocial);
    // Check type
    if (user) {
      const typeExist = user.type;
      if (typeSocial !== typeExist) {
        throw new BadRequestException(`Email: ${emailSocial} đã tồn tại trên hệ thống. Vui lòng sử dụng email khác.`);
      }
    } else {
      // New login with social
      user = await this.usersService.createUserSocial(loginSocial);
    }

    const { email, name, type, _id } = user;

    const payload = {
      sub: 'social login',
      iss: 'from server',
      _id,
      name,
      email,
      type,
    };

    const refreshToken = this.createRefreshToken(payload);

    // Update user with token
    await this.usersService.updateUserToken(refreshToken, _id.toString());

    // Set refresh token to cookie
    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: ms(this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRE')),
    });

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: refreshToken,
      user: {
        _id,
        name,
        email,
        type,
      },
    };
  }

  createRefreshToken = (payload) => {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRE'),
    });
  };

  processNewToken = async (refreshToken: string, response: Response) => {
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });

      let user = await this.usersService.findUserByToken(refreshToken);

      if (user) {
        const { _id, name, email, type } = user;
        const payload = {
          sub: 'token refresh',
          iss: 'from server',
          _id,
          name,
          email,
          type,
        };

        const refresh_token = this.createRefreshToken(payload);

        //update user with refresh token
        await this.usersService.updateUserToken(refresh_token, _id.toString());

        //set refresh_token as cookies
        response.clearCookie('refresh_token');

        response.cookie('refresh_token', refresh_token, {
          httpOnly: true,
          maxAge: ms(this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRE')),
        });

        return {
          access_token: this.jwtService.sign(payload),
          user: {
            _id,
            name,
            email,
            type,
          },
        };
      } else {
        throw new BadRequestException(`Refresh token không hợp lệ. Vui lòng login.`);
      }
    } catch (error) {
      throw new BadRequestException(`Refresh token không hợp lệ. Vui lòng login.`);
    }
  };

  logout = async (response: Response, user: IUser) => {
    await this.usersService.updateUserToken('', user._id);
    response.clearCookie('refresh_token');
    return 'ok';
  };
}
