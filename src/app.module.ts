import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StatisticsModule } from './statistics/statistics.module';
import configuration from './config/app.config';

const AppConfigModule = ConfigModule.forRoot({
  load: [configuration],
});

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: async (configService: ConfigService) => ({
        url: configService.get('database.url'),
        type: configService.get('database.type'),
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    StatisticsModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
