import { Controller, Get, UseGuards, Put, Body } from '@nestjs/common';
import { RuleService } from './rule.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminAuthGuard } from '../auth/admin-auth.guard';
import { Rule } from './rule';

@UseGuards(JwtAuthGuard)
@Controller('rules')
export class RuleController {
  constructor(private readonly ruleService: RuleService) {}

  @Get()
  public getRules() {
    return this.ruleService.getRules();
  }

  @UseGuards(AdminAuthGuard)
  @Put()
  public setRules(@Body() rules: Rule[]) {
    return this.ruleService.setRules(rules);
  }
}
