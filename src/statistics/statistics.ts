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
  @Column()
  public start: number;

  @Expose()
  @Column()
  public filled: number;

  @Expose()
  @Column()
  public inspected: number;

  @Expose()
  @Column()
  public ready: number;

  @Expose()
  @Column({ nullable: true })
  public working: boolean;

  @Expose()
  public get startFailed() {
    return this.start - this.filled;
  }

  @Expose()
  public get midFailed() {
    return this.filled - this.inspected;
  }

  @Expose()
  public get endFailed() {
    return this.inspected - this.ready;
  }
}
