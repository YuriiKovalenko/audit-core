import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rule } from './rule';
import { Repository } from 'typeorm';

@Injectable()
export class RuleService implements OnApplicationBootstrap {
  private readonly props: { name: string; description: string }[];

  constructor(
    @InjectRepository(Rule) private readonly ruleRepository: Repository<Rule>,
  ) {
    this.props = [
      { name: 'fillFailed', description: 'Втрати закрутки' },
      { name: 'inspectFailed', description: 'Втрати відбраковки' },
      { name: 'readyFailed', description: 'Втрати розвантажувача' },
    ];
  }

  async onApplicationBootstrap() {
    this.props.forEach(async prop => {
      const rule = await this.ruleRepository.findOne({
        where: { propertyName: prop.name },
      });
      if (!rule) {
        await this.ruleRepository.save({
          propertyName: prop.name,
          description: prop.description,
        });
      }
    });
  }

  public getRules() {
    return this.ruleRepository.find({ order: { id: 'ASC' } });
  }

  public setRules(rules: Rule[]) {
    return this.ruleRepository.save(rules);
  }
}
