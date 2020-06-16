import { Between, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Statistics } from './statistics';
import { StatisticsInput } from './statistics.input';

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

  public async createStatistics(statisticsInput: StatisticsInput) {
    const statistics = this.mapInput(statisticsInput);
    await this.statisticsRepository.save(statistics);
  }

  public mapInput(statisticsInput: StatisticsInput) {
    return this.statisticsRepository.create({
      data: statisticsInput.data,
      createdAt: statisticsInput.date,
      working: statisticsInput.working,
    });
  }
}
