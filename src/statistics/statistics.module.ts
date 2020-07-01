import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RawStatistics } from './raw-statistics';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { StatisticsMapper } from './statistics.mapper';
import { RawLatest } from './raw-latest';
import { SheetService } from './sheet.service';

@Module({
  controllers: [StatisticsController],
  imports: [TypeOrmModule.forFeature([RawStatistics, RawLatest])],
  providers: [StatisticsService, StatisticsMapper, SheetService],
  exports: [StatisticsService],
})
export class StatisticsModule {}
