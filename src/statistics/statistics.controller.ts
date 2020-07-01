import {
  Controller,
  Get,
  Query,
  UseGuards,
  Post,
  Body,
  Res,
  Header,
} from '@nestjs/common';
import { ParseDatePipe } from '../shared/pipes/parse-date.pipe';
import { StatisticsService } from './statistics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StatisticsInput } from './statistics.input';
import { ServerResponse } from 'http';
import { dateToLocaleDateString } from '../utils';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  public getStatistics(
    @Query('startDate', ParseDatePipe) startDate: Date,
    @Query('endDate', ParseDatePipe) endDate: Date,
  ) {
    return this.statisticsService.getStatisticsByTimeframe(startDate, endDate);
  }

  @UseGuards(JwtAuthGuard)
  @Get('hourly')
  public getStatisticsHourly(
    @Query('startDate', ParseDatePipe) startDate: Date,
    @Query('endDate', ParseDatePipe) endDate: Date,
  ) {
    return this.statisticsService.getStatisticsHourly(startDate, endDate);
  }

  @UseGuards(JwtAuthGuard)
  @Get('status')
  public getStatus(
    @Query('startDate', ParseDatePipe) startDate: Date,
    @Query('endDate', ParseDatePipe) endDate: Date,
  ) {
    return this.statisticsService.getStatus(startDate, endDate);
  }

  @UseGuards(JwtAuthGuard)
  @Get('summary')
  public async getSum(
    @Query('startDate', ParseDatePipe) startDate: Date,
    @Query('endDate', ParseDatePipe) endDate: Date,
  ) {
    const status = await this.statisticsService.getStatus(startDate, endDate);
    return status.summed;
  }

  @UseGuards(JwtAuthGuard)
  @Get('lines')
  public async getLines(
    @Query('startDate', ParseDatePipe) startDate: Date,
    @Query('endDate', ParseDatePipe) endDate: Date,
  ) {
    return this.statisticsService.getLines(startDate, endDate);
  }

  @Post()
  public createStatistics(@Body() statisticsInput: StatisticsInput) {
    console.log(JSON.stringify(statisticsInput));
    return this.statisticsService.createStatistics(statisticsInput);
  }

  @Get('report')
  @Header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  public async getReport(
    @Query('startDate', ParseDatePipe) startDate: Date,
    @Query('endDate', ParseDatePipe) endDate: Date,
    @Res() res: ServerResponse,
  ) {
    const fileStream = await this.statisticsService.getReport(
      startDate,
      endDate,
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="Report_${dateToLocaleDateString(
        startDate,
      )}-${dateToLocaleDateString(endDate)}.xlsx"`,
    );

    fileStream.pipe(res);
  }
}
