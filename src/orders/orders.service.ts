import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BcvService } from '../bcv/bcv.service';
import { CreateOrderDto, UpdateOrderDto } from './dto/order.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private bcvService: BcvService
  ) {}

  async create(data: CreateOrderDto) {
    const tasaBCV = await this.bcvService.getTasaBCV();

    const total = data.items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

    const totalBs = total * Number(tasaBCV);

    return this.prisma.order.create({
      data: {
        clientId: data.clientId,
        status: OrderStatus.PENDING,
        total,
        totalBs,
        tasaBCV,
        items: {
          create: data.items
        },
        history: {
          create: {
            clientId: data.clientId,
            status: OrderStatus.PENDING
          }
        },
        ...(data.cuponId && { cupon: { connect: { id: data.cuponId } } })
      },
      include: {
        items: {
          include: {
            product: true,
            variant: true
          }
        },
        history: true,
        cupon: true
      }
    });
  }

  findAll() {
    return this.prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
            variant: true
          }
        },
        history: true,
        cupon: true
      }
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
            variant: true
          }
        },
        history: true,
        cupon: true
      }
    });
    if (!order) throw new NotFoundException('Orden no encontrada');
    return order;
  }

  async update(id: string, data: UpdateOrderDto) {
    if (data.status) {
      await this.prisma.orderHistory.create({
        data: {
          orderId: id,
          clientId: (await this.findOne(id)).clientId,
          status: data.status
        }
      });
    }

    return this.prisma.order.update({
      where: { id },
      data: {
        status: data.status,
        ...(data.cuponId && { cupon: { connect: { id: data.cuponId } } })
      },
      include: {
        items: {
          include: {
            product: true,
            variant: true
          }
        },
        history: true,
        cupon: true
      }
    });
  }

  async remove(id: string) {
    return this.prisma.order.delete({ where: { id } });
  }
}
