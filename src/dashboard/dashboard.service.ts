import { Injectable } from '@nestjs/common';
import { StatisticsService } from '../statistics/statistics.service';

@Injectable()
export class DashboardService {
  constructor(private readonly statisticsService: StatisticsService) {}
}
