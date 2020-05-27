import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rule } from './rule';
import { Repository } from 'typeorm';

@Injectable()
export class RuleService {
  constructor(
    @InjectRepository(Rule) private readonly ruleRepository: Repository<Rule>,
  ) {}

  public getRules() {
    return this.ruleRepository.find();
  }

  public createRules() {
    return this.ruleRepository;
  }
}
