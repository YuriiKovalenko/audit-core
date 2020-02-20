import {
  Controller,
  Get,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ParseDatePipe } from 'src/shared/pipes/parse-date.pipe';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  public getStatistics(
    @Query('startDate', ParseDatePipe) startDate: Date,
    @Query('endDate', ParseDatePipe) endDate: Date,
  ) {
    return this.statisticsService.getStatisticsByTimeframe(startDate, endDate);
  }
}
