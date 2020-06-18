import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('statistics')
export class RawStatistics {
  @PrimaryGeneratedColumn({ unsigned: true })
  public id: number;

  @Column({ name: 'created_at', type: 'timestamp with time zone' })
  public createdAt: Date;

  @Column('int', { array: true })
  public data: number[];

  @Column()
  public working: boolean;
}
