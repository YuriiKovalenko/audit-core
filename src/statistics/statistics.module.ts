import { Module } from '@nestjs/common';
import { StatisticsController } from './statistics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Statistics } from './statistics';

@Module({
  controllers: [StatisticsController],
  imports: [TypeOrmModule.forFeature([Statistics])],
})
export class StatisticsModule {}
