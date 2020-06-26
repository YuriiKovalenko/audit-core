import { Injectable } from '@nestjs/common';
import { RawStatistics } from './raw-statistics';
import { Statistics } from './statistics';

@Injectable()
export class StatisticsMapper {
  public map(stat: RawStatistics): Statistics {
    return {
      id: stat.id,
      working: stat.working,
      createdAt: stat.createdAt,
      start: stat.data[3],
      covered: stat.data[10] + stat.data[11] + stat.data[12],
      checked: stat.data[0] + stat.data[1] + stat.data[2],
      ready: stat.data[6] + stat.data[7] + stat.data[8] + stat.data[9],
    };
  }
}
