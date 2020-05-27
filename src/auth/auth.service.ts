import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { HashService } from './hash/hash.service';
import { User } from '../user/user';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
  ) {}

  public async validateUser(username: string, password: string) {
    const user = await this.userService.getUserByUsername(username);
    if (this.hashService.verify(password, user.password)) {
      delete user.password;
      return user;
    }
    return null;
  }

  public login(user: User) {
    const payload = {
      username: user.username,
      sub: user.id,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  public async register(username: string, password: string) {
    return this.userService.createUser(
      username,
      this.hashService.generate(password),
    );
  }
}
