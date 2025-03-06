import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';

@Injectable()
export class DeliveryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDeliveryDto: CreateDeliveryDto) {
    const { zona, tarifa, isActive } = createDeliveryDto;
    return this.prisma.deliveryZone.create({
      data: {
        zona,
        tarifa,
        isActive: isActive ?? true
      }
    });
  }

  async findAll(onlyActive: boolean = false) {
    if (onlyActive) {
      return this.prisma.deliveryZone.findMany({
        where: {
          isActive: true
        }
      });
    }
    return this.prisma.deliveryZone.findMany();
  }

  async findOne(id: string) {
    const zone = await this.prisma.deliveryZone.findUnique({
      where: { id }
    });

    if (!zone) {
      throw new NotFoundException('Zona de entrega no encontrada');
    }

    return zone;
  }

  async findByZone(zona: string) {
    const zone = await this.prisma.deliveryZone.findFirst({
      where: { 
        zona,
        isActive: true
      }
    });

    if (!zone) {
      throw new NotFoundException('Zona de entrega no encontrada');
    }

    return zone;
  }

  async update(id: string, updateDeliveryDto: UpdateDeliveryDto) {
    const zone = await this.prisma.deliveryZone.findUnique({
      where: { id }
    });

    if (!zone) {
      throw new NotFoundException('Zona de entrega no encontrada');
    }

    return this.prisma.deliveryZone.update({
      where: { id },
      data: updateDeliveryDto
    });
  }

  async remove(id: string) {
    const zone = await this.prisma.deliveryZone.findUnique({
      where: { id }
    });

    if (!zone) {
      throw new NotFoundException('Zona de entrega no encontrada');
    }

    return this.prisma.deliveryZone.update({
      where: { id },
      data: { isActive: false }
    });
  }
}
