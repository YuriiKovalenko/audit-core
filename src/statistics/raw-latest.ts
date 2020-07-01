import { RawStatistics } from './raw-statistics';
import { Entity } from 'typeorm';

@Entity('latest')
export class RawLatest extends RawStatistics {}
