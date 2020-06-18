import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RawStatistics } from './raw-statistics';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { StatisticsMapper } from './statistics.mapper';

@Module({
  controllers: [StatisticsController],
  imports: [TypeOrmModule.forFeature([RawStatistics])],
  providers: [StatisticsService, StatisticsMapper],
})
export class StatisticsModule {}
