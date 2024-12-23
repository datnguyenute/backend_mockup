import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { CreateUserSocialDto, RegisterUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { Request, Response } from 'express';
import { IUser } from 'src/users/users.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ResponseMessage('User Login')
  async login(@Req() req, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user, response);
  }

  // Register
  @Public()
  @ResponseMessage('User register')
  @Post('register')
  async register(@Body() req: RegisterUserDto) {
    return this.userService.register(req);
  }

  @Public()
  @Post('social-media')
  @ResponseMessage('User social-media login')
  async loginSocial(@Body() createUserSocialDto: CreateUserSocialDto, @Res({ passthrough: true }) response: Response) {
    return this.authService.loginSocial(createUserSocialDto, response);
  }

  @Get('account')
  handleGetAccount(@User() user: IUser) {
    return { user };
  }

  @Public()
  @ResponseMessage('Get User by refresh token')
  @Get('refresh')
  handleRefreshToken(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const refreshToken = request.cookies['refresh_token'];
    return this.authService.processNewToken(refreshToken, response);
  }

  @Post('logout')
  async handleLogout(@Res({ passthrough: true }) response: Response, @User() user: IUser) {
    return await this.authService.logout(response, user);
  }
}
