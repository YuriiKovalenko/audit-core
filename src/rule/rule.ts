import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Expose } from 'class-transformer';

@Entity()
export class Rule {
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column({ unique: true })
  propertyName: string;

  @Expose()
  @Column({ default: 0 })
  ok: number;

  @Expose()
  @Column({ default: 0 })
  normal: number;

  @Expose()
  @Column({ default: 0 })
  danger: number;
}
