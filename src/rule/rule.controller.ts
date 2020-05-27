import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { RuleService } from './rule.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminAuthGuard } from '../auth/admin-auth.guard';

@UseGuards(JwtAuthGuard, AdminAuthGuard)
@Controller('rules')
export class RuleController {
  constructor(private readonly ruleService: RuleService) {}

  @Get()
  public getRules(@Req() req: any) {
    console.log(req.user);
  }
}
