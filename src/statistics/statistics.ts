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
  public checked: number;

  @Expose()
  @Column()
  public covered: number;

  @Expose()
  @Column()
  public inspected: number;

  @Expose()
  @Column()
  public dried: number;

  @Expose()
  @Column()
  public type: string;

  @Expose()
  public get startFailed() {
    return this.start - this.checked;
  }

  @Expose()
  public get midFailed() {
    return this.covered - this.inspected;
  }

  @Expose()
  public get endFailed() {
    return this.inspected - this.dried;
  }
}
