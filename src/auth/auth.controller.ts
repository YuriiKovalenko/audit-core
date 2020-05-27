import {
  Controller,
  UseGuards,
  Post,
  Request,
  Body,
  Req,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  public createuser(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    return this.authService.register(username, password);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  public loginUser(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('validate')
  public validateToken(@Req() request: any) {
    return request.user;
  }
}
