import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user';
import { Repository } from 'typeorm';
import { Role } from './role';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}

  public async getUserByUsername(username: string) {
    const user = await this.userRepository.findOne({ username });

    if (!user) {
      throw new NotFoundException('Username is incorrect.');
    }

    return user;
  }

  public async createUser(username: string, password: string) {
    if (await this.userRepository.findOne({ username })) {
      throw new ForbiddenException('Username is not unique');
    }
    return this.userRepository
      .save({ username, password })
      .then(({ id, username }) => ({ id, username }));
  }

  public async getUserRoles(id: number) {
    const user = await this.userRepository.findOne(id, {
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException('User is invalid.');
    }

    return user.roles || [];
  }
}
