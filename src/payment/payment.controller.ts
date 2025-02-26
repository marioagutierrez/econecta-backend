import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  GenerateOtpDto,
  DebitoInmediatoDto,
  OtpResponse,
  DebitoResponse,
} from './dto/payment.dto';
// import { OrderStatus } from '@prisma/client';
import { FirebaseService } from '../firebase/firebase.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly mailService: MailService,
    private readonly prisma: PrismaService,
    private readonly firebaseService: FirebaseService,
  ) {}

  @ApiOperation({ summary: 'Generar código OTP' })
  @ApiResponse({
    status: 201,
    description: 'OTP generado exitosamente',
    type: OtpResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
  })
  @ApiResponse({
    status: 503,
    description: 'Servicio de pago no disponible',
  })
  @Post('generate-otp')
  generateOtp(@Body() data: GenerateOtpDto): Promise<OtpResponse> {
    return this.paymentService.generateOtp(data);
  }

  @ApiOperation({ summary: 'Procesar pago con débito inmediato' })
  @ApiResponse({
    status: 201,
    description: 'Pago procesado exitosamente',
    type: DebitoResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Error en el pago',
  })
  @ApiResponse({
    status: 503,
    description: 'Servicio de pago no disponible',
  })
  @Post('process-payment')
  async processPayment(
    @Body() data: DebitoInmediatoDto,
  ): Promise<DebitoResponse> {
    // const paymentResult =
    //   await this.paymentService.processDebitoInmediato(data);

    // Buscar la orden relacionada con este pago
    // const order = await this.prisma.order.findFirst({
    //   where: {
    //     totalBs: parseFloat(data.monto),
    //     status: 'PENDING',
    //   },
    //   include: {
    //     items: {
    //       include: {
    //         product: true,
    //       },
    //     },
    //     client: true,
    //   },
    // });

    // if (order) {
    //   // Crear usuario en Firebase
    //   await this.firebaseService.createFirebaseUser({
    //     email: order.client.email,
    //     password: 'temporal123', // Deberías generar una contraseña temporal
    //     userName: order.client.username || order.client.email.split('@')[0],
    //     firstName: order.client.name?.split(' ')[0] || '',
    //     lastName: order.client.name?.split(' ')[1] || '',
    //     accountType: order.client.type,
    //     cedula: order.client.document ?? '',
    //     companyName:
    //       order.client.type === 'EMPRESA' ? (order.client.name ?? '') : '',
    //   });

    //   // Enviar email de confirmación
    //   await this.mailService.sendOrderConfirmation({
    //     id: order.id,
    //     total: Number(order.total),
    //     totalBs: Number(order.totalBs),
    //     tasaBCV: Number(order.tasaBCV),
    //     items: order.items.map((item) => ({
    //       quantity: item.quantity,
    //       price: Number(item.price),
    //       product: {
    //         name: item.product.name,
    //       },
    //     })),
    //     client: {
    //       email: order.client.email,
    //     },
    //   });

    //   // Actualizar estado de la orden
    //   await this.prisma.order.update({
    //     where: { id: order.id },
    //     data: {
    //       status: OrderStatus.COMPLETED,
    //       paymentReference: paymentResult.reference,
    //     },
    //   });
    // }

    return this.paymentService.processDebitoInmediato(data);
  }
}
