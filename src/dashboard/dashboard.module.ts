import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { StatisticsModule } from '../statistics/statistics.module';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService],
  imports: [StatisticsModule],
})
export class DashboardModule {}
