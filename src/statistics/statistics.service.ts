import { Between, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Statistics } from './statistics';
import { StatisticsInput } from './statistics.input';
import { dateTruncate, groupBy } from '../utils';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Statistics)
    private readonly statisticsRepository: Repository<Statistics>,
  ) {}

  public getStatisticsByTimeframe(
    startDate: Date = new Date(),
    endDate: Date = new Date(),
  ) {
    return this.statisticsRepository.find({
      where: { createdAt: Between(startDate, endDate) },
      order: { createdAt: 'DESC' },
    });
  }

  public async getStatisticsHourly(
    startDate: Date = new Date(),
    endDate: Date = new Date(),
  ) {
    const stats = await this.statisticsRepository
      .find({
        where: { createdAt: Between(startDate, endDate) },
        order: { createdAt: 'DESC' },
      })
      .then(stats =>
        stats.map<Statistics>(stat => ({
          ...stat,
          createdAt: dateTruncate('hour', stat.createdAt),
        })),
      );
    const groups = Object.values(groupBy(stats, 'createdAt'));
    return groups.map<Statistics>((group: Statistics[]) =>
      group.reduce((acc, stat) => ({
        ...acc,
        data: acc.data.map((e, i) => e + stat.data[i]),
      })),
    );
  }

  public async createStatistics(statisticsInput: StatisticsInput) {
    const statistics = this.mapInput(statisticsInput);
    return this.statisticsRepository.save(statistics);
  }

  public mapInput(statisticsInput: StatisticsInput) {
    return this.statisticsRepository.create({
      data: statisticsInput.data,
      createdAt: statisticsInput.date,
      working: statisticsInput.working,
    });
  }
}
