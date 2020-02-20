import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Statistics } from './statistics';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';

@Module({
  controllers: [StatisticsController],
  imports: [TypeOrmModule.forFeature([Statistics])],
  providers: [StatisticsService],
})
export class StatisticsModule {}
