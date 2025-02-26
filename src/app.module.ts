import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { BcvModule } from './bcv/bcv.module';
import { PaymentModule } from './payment/payment.module';
import { CuponesModule } from './cupones/cupones.module';
import { JwtExceptionFilter } from './auth/filters/jwt-exception.filter';
import { DeliveryModule } from './delivery/delivery.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    AuthModule,
    ClientsModule,
    ProductsModule,
    OrdersModule,
    MailModule,
    BcvModule,
    PaymentModule,
    CuponesModule,
    DeliveryModule,
  ],
  // controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: JwtExceptionFilter,
    }
  ],
})
export class AppModule {}
