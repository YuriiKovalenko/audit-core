import { PrimaryGeneratedColumn, Column, ManyToMany, Entity } from 'typeorm';
import { User } from './user';

export enum RoleName {
  Admin = 'admin',
  User = 'user',
}

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, enum: RoleName })
  name: RoleName;

  @ManyToMany(
    () => User,
    user => user.roles,
  )
  users: User[];
}
