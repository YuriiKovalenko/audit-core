import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RawStatistics } from './raw-statistics';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { StatisticsMapper } from './statistics.mapper';
import { RawLatest } from './raw-latest';

@Module({
  controllers: [StatisticsController],
  imports: [TypeOrmModule.forFeature([RawStatistics, RawLatest])],
  providers: [StatisticsService, StatisticsMapper],
  exports: [StatisticsService],
})
export class StatisticsModule {}
