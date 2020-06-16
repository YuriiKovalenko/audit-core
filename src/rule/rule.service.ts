import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rule } from './rule';
import { Repository } from 'typeorm';
import { Statistics } from '../statistics/statistics';
import { classToPlain } from 'class-transformer';

@Injectable()
export class RuleService implements OnApplicationBootstrap {
  private readonly names: string[];

  constructor(
    @InjectRepository(Rule) private readonly ruleRepository: Repository<Rule>,
  ) {
    this.names = Object.keys(classToPlain(new Statistics())).filter(key => key.includes('Failed'));
  }

  async onApplicationBootstrap() {
    this.names.forEach(async name => {
      const rule = await this.ruleRepository.find({ where: { propertyName: name }});
      if (!rule) {
        await this.ruleRepository.save({ propertyName: name });
      }
    })
  }

  public getRules() {
    return this.ruleRepository.find({ order: { id: 'ASC' }});
  }

  public setRules(rules: Rule[]) {
    return this.ruleRepository.save(rules);
  }
}
