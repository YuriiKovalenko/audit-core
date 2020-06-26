import { Between, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { RawStatistics } from './raw-statistics';
import { StatisticsInput } from './statistics.input';
import { dateTruncate, groupBy } from '../utils';
import { StatisticsMapper } from './statistics.mapper';
import { Statistics } from './statistics';
import { RawLatest } from './raw-latest';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(RawStatistics)
    private readonly statisticsRepository: Repository<RawStatistics>,
    @InjectRepository(RawLatest)
    private readonly rawLatestRepository: Repository<RawLatest>,
    private readonly mapper: StatisticsMapper,
  ) {}

  public async getStatisticsByTimeframe(
    startDate: Date = new Date(),
    endDate: Date = new Date(),
  ) {
    const stats = await this.statisticsRepository.find({
      where: { createdAt: Between(startDate, endDate) },
      order: { createdAt: 'ASC' },
    });
    return stats.map(stat => this.mapper.map(stat));
  }

  public async getStatisticsHourly(
    startDate: Date = new Date(),
    endDate: Date = new Date(),
  ) {
    const stats = await this.getStatisticsByTimeframe(startDate, endDate).then(
      stats =>
        stats.map(stat => ({
          ...stat,
          createdAt: dateTruncate('hour', stat.createdAt),
        })),
    );
    const groups: Statistics[][] = Object.values(groupBy(stats, 'createdAt'));
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

    await this.rawLatestRepository.update({}, statistics);
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

  public async getLine3(startDate: Date, endDate: Date) {
    const stats = await this.statisticsRepository.find({
      where: { createdAt: Between(startDate, endDate) },
      order: { createdAt: 'ASC' },
    });

    return stats.reduce(
      (acc, val) => ({
        covered: acc.covered + val.data[10],
        checked: acc.checked + val.data[0],
      }),
      { covered: 0, checked: 0 },
    );
  }

  private mapInput(statisticsInput: StatisticsInput) {
    return this.statisticsRepository.create({
      data: statisticsInput.data,
      createdAt: statisticsInput.date,
      working: statisticsInput.working,
    });
  }
}
