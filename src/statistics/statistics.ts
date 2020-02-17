import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Statistics {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public timestamp: Date;

  @Column()
  public start: number;
  
  @Column()
  public checked: number;
  
  @Column()
  public covered: number;
  
  @Column()
  public inspected: number;
  
  @Column()
  public dried: number;
  
  @Column()
  public type: string;
}