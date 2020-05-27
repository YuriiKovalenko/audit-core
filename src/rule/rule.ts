import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Expose } from 'class-transformer';

@Entity()
export class Rule {
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column()
  propertyName: string;

  @Expose()
  @Column()
  ok: number;

  @Expose()
  @Column()
  normal: number;

  @Expose()
  @Column()
  danger: number;
}
