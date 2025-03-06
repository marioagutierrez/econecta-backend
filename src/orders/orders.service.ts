import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BcvService } from '../bcv/bcv.service';
import { CreateOrderDto, UpdateOrderDto } from './dto/order.dto';
import { OrderStatus } from '@prisma/client';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private bcvService: BcvService
  ) {}

  async create(data: CreateOrderDto) {
    return this.prisma.order.create({
      data: {
        clientId: data.clientId,
        status: OrderStatus.PENDING,
        total: data.total,
        totalBs: data.totalBs,
        tasaBCV: data.tasaBCV,
        IVA: data.IVA,
        shippingMethod: data.shippingMethod,
        shippingAddress: data.shippingAddress,
        items: {
          create: data.items
        },
        history: {
          create: {
            clientId: data.clientId,
            status: OrderStatus.PENDING
          }
        },
        ...(data.cuponId && { cupon: { connect: { id: data.cuponId } } }),
        ...(data.invoice && {
          invoice: {
            create: {
              ...data.invoice
            }
          }
        })
      },
      include: {
        items: {
          include: {
            product: true,
            variant: true
          }
        },
        history: true,
        cupon: true,
        invoice: true
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
        cupon: true,
        invoice: true
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
    // Primero verificamos si la orden existe
    const order = await this.findOne(id);
    if (!order) {
      throw new NotFoundException('Orden no encontrada');
    }

    // Eliminamos en transacción para asegurar la integridad
    return this.prisma.$transaction(async (tx: PrismaClient) => {
      // 1. Eliminar historial
      if (order.history) {
        await tx.orderHistory.delete({
          where: { orderId: id }
        });
      }

      // 2. Eliminar items
      await tx.orderItem.deleteMany({
        where: { orderId: id }
      });

      // 3. Eliminar factura si existe
      if (order.invoice) {
        await tx.invoice.deleteMany({
          where: { orderId: id }
        });
      }

      // 4. Desconectar cupón si existe
      if (order.cupon) {
        await tx.cupones.update({
          where: { orderId: id },
          data: { orderId: null }
        });
      }

      // 5. Finalmente eliminamos la orden
      return tx.order.delete({
        where: { id }
      });
    });
  }

  async updateStatus(id: string, status: OrderStatus) {
    const order = await this.findOne(id);
    
    if (!order) {
      throw new NotFoundException('Orden no encontrada');
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Actualizar o crear el historial
      if (order.history) {
        await tx.orderHistory.update({
          where: { orderId: id },
          data: {
            status,
            clientId: order.clientId
          }
        });
      } else {
        await tx.orderHistory.create({
          data: {
            orderId: id,
            clientId: order.clientId,
            status
          }
        });
      }

      // 2. Actualizar la orden
      return tx.order.update({
        where: { id },
        data: {
          status
        },
        include: {
          items: {
            include: {
              product: true,
              variant: true
            }
          },
          history: true,
          cupon: true,
          invoice: true
        }
      });
    });
  }
}
