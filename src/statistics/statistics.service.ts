import { Between, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Statistics } from './statistics';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Statistics)
    private readonly statisticsRepository: Repository<Statistics>,
  ) {}

  public async getStatisticsByTimeframe(
    startDate: Date = new Date(),
    endDate: Date = new Date(),
  ) {
    return this.statisticsRepository.find({
      where: { createdAt: Between(startDate, endDate) },
      order: { createdAt: 'DESC' },
    });
  }
}
