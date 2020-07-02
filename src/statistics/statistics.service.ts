import { Between, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { RawStatistics } from './raw-statistics';
import { StatisticsInput } from './statistics.input';
import { roundDate, groupBy } from '../utils';
import { StatisticsMapper } from './statistics.mapper';
import { Statistics } from './statistics';
import { RawLatest } from './raw-latest';
import { SheetService } from './sheet.service';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(RawStatistics)
    private readonly statisticsRepository: Repository<RawStatistics>,
    @InjectRepository(RawLatest)
    private readonly rawLatestRepository: Repository<RawLatest>,
    private readonly mapper: StatisticsMapper,
    private readonly sheetService: SheetService,
  ) {}

  private getRawStatisticByTimeFrame(
    startDate: Date = new Date(),
    endDate: Date = new Date(),
  ) {
    return this.statisticsRepository.find({
      where: { createdAt: Between(startDate, endDate) },
      order: { createdAt: 'ASC' },
    });
  }

  private groupByPrecisionInterval(
    statistics: Statistics[] | RawStatistics[],
    interval: number,
    key: string
  ): (Statistics[] | RawStatistics[])[] {
    const truncatedStats = [];
    for (const stat of statistics) {
      truncatedStats.push({
        ...stat,
        createdAt: roundDate(interval, key, stat.createdAt),
      });
    }
    return Object.values(groupBy(truncatedStats, 'createdAt'));
  }

  public async getStatisticsByTimeframe(
    startDate: Date = new Date(),
    endDate: Date = new Date(),
  ) {
    const stats = await this.getRawStatisticByTimeFrame(startDate, endDate);
    return stats.map(stat => this.mapper.map(stat));
  }

  public async getStatisticsByInterval(
    startDate: Date = new Date(),
    endDate: Date = new Date(),
    interval = 60,
    key = 'minute'
  ) {
    const groups = await this.getStatisticsByTimeframe(startDate, endDate).then(
      stats => this.groupByPrecisionInterval(stats, interval, key) as Statistics[][],
    );
    return groups.map(group => this.getSummedStatistics(group));
  }

  public async createStatistics(statisticsInput: StatisticsInput) {
    if (
      !statisticsInput.data.length ||
      statisticsInput.data.every(e => e === 0)
    ) {
      return;
    }
    const statistics = this.mapInput(statisticsInput);
    const latest = await this.rawLatestRepository.findOne();

    await this.rawLatestRepository.save({ ...statistics, id: 1 });
    if (!latest) {
      const existing = await this.statisticsRepository.find({
        order: { createdAt: 'ASC' },
      });

      if (!existing.length) {
        return this.statisticsRepository.save(statistics);
      }

      const latest = existing.reduce((acc, val) => {
        return {
          ...acc,
          data: acc.data.map((e, i) => e + val.data[i]),
        };
      });
      return this.statisticsRepository.save({
        ...statistics,
        data: statistics.data.map((e, i) => e - latest.data[i]),
      });
    }
    return this.statisticsRepository.save({
      ...statistics,
      data: statistics.data.map((e, i) => e - latest.data[i]),
    });
  }

  public async getStatus(startDate: Date, endDate: Date) {
    const statistics = await this.getStatisticsByTimeframe(startDate, endDate);
    return {
      summed: this.getSummedStatistics(statistics),
    };
  }

  private getSummedStatistics(statistics: Statistics[]) {
    return statistics.reduce(
      (acc, val) => ({
        start: acc.start + val.start,
        covered: acc.covered + val.covered,
        checked: acc.checked + val.checked,
        ready: acc.ready + val.ready,
        id: val.id,
        createdAt: acc.createdAt,
        working: acc.working || val.working,
      }),
      {
        checked: 0,
        start: 0,
        covered: 0,
        id: 0,
        ready: 0,
        createdAt: statistics[0]?.createdAt || new Date(),
        working: false,
      },
    );
  }

  private getSummedRaw(statistics: RawStatistics[]) {
    return statistics.reduce(
      (acc, val) => ({
        data: acc.data.map((e, i) => e + val.data[i]),
        createdAt: acc.createdAt,
        working: acc.working || val.working,
      }),
      {
        data: new Array(15).fill(0),
        createdAt: statistics[0]?.createdAt || new Date(),
        working: false,
      },
    );
  }

  public async getLines(startDate: Date, endDate: Date) {
    const stats = await this.getRawStatisticByTimeFrame(startDate, endDate);
    const summed = this.getSummedRaw(stats);
    return {
      lines: [
        summed.data[10],
        summed.data[12],
        summed.data[11],
        summed.data[5],
      ],
    };
  }

  private mapInput(statisticsInput: StatisticsInput) {
    return this.statisticsRepository.create({
      data: statisticsInput.data,
      createdAt: statisticsInput.date,
      working: statisticsInput.working,
    });
  }

  public async getReport(startDate: Date, endDate: Date, interval: number, key: string) {
    const stats = await this.getRawStatisticByTimeFrame(startDate, endDate);
    const groups = this.groupByPrecisionInterval(stats, interval, key) as RawStatistics[][];
    const summed = groups.map(group => this.getSummedRaw(group));
    return this.sheetService.createTable(summed, startDate, endDate);
  }
}
