import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { BcvService } from './bcv.service';
import { BcvController } from './bcv.controller';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [BcvService],
  exports: [BcvService],
  controllers: [BcvController],
})
export class BcvModule {}
