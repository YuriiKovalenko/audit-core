import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Expose, Exclude } from 'class-transformer';

@Entity()
export class Statistics {
  @Exclude()
  @PrimaryGeneratedColumn()
  public id: number;

  @Expose()
  @Column({ name: 'created_at', type: 'timestamp with time zone' })
  public createdAt: Date;

  @Expose()
  @Column('int', { array: true })
  public data: number[];

  @Expose()
  @Column()
  public working: boolean;
}
