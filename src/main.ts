import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Econecta API')
    .setDescription('API de servicios de Econecta')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Autenticación')
    .addTag('clients', 'Gestión de clientes')
    .addTag('orders', 'Gestión de órdenes')
    .addTag('products', 'Gestión de productos')
    .addTag('payment', 'Servicios de pago')
    .addTag('bcv', 'Tasa del BCV')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
