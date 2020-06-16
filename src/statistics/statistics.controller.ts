import {
  Controller,
  Get,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  Post,
  Body,
} from '@nestjs/common';
import { ParseDatePipe } from 'src/shared/pipes/parse-date.pipe';
import { StatisticsService } from './statistics.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { StatisticsInput } from './statistics.input';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  public getStatistics(
    @Query('startDate', ParseDatePipe) startDate: Date,
    @Query('endDate', ParseDatePipe) endDate: Date,
  ) {
    return this.statisticsService.getStatisticsByTimeframe(startDate, endDate);
  }

  @Post()
  public createStatistics(@Body() statisticsInput: StatisticsInput) {
    console.log(statisticsInput);
    return this.statisticsService.createStatistics(statisticsInput);
  }
}
