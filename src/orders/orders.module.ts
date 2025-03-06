import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { BcvModule } from '../bcv/bcv.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [BcvModule, PrismaModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService]
})
export class OrdersModule {}
