import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCuponDto, UpdateCuponDto } from './dto/cupon.dto';

@Injectable()
export class CuponesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCuponDto) {
    return this.prisma.cupones.create({
      data: {
        ...data,
        usedCount: 0
      },
      include: {
        uses: true,
        order: true
      }
    });
  }

  async findAll() {
    return this.prisma.cupones.findMany({
      include: {
        uses: {
          include: {
            client: true
          }
        },
        order: true
      }
    });
  }

  async findOne(id: string) {
    const cupon = await this.prisma.cupones.findUnique({
      where: { id },
      include: {
        uses: {
          include: {
            client: true
          }
        },
        order: true
      }
    });
    if (!cupon) throw new NotFoundException('Cupón no encontrado');
    return cupon;
  }

  async findByCodigo(codigo: string) {
    const cupon = await this.prisma.cupones.findUnique({
      where: { codigo },
      include: {
        uses: {
          include: {
            client: true
          }
        },
        order: true
      }
    });

    if (!cupon) throw new NotFoundException('Cupón no encontrado');
    
    const isValid = 
      (!cupon.maturyAt || cupon.maturyAt > new Date()) &&
      (!cupon.maxUses || cupon.usedCount < cupon.maxUses);

    if (!isValid) {
      const reason = cupon.maturyAt && cupon.maturyAt < new Date() 
        ? 'vencido' 
        : 'alcanzó el máximo de usos';
      throw new BadRequestException(`Cupón ${reason}`);
    }

    return {
      ...cupon,
      live: isValid
    };
  }

  async update(id: string, data: UpdateCuponDto) {
    return this.prisma.cupones.update({
      where: { id },
      data,
      include: {
        uses: {
          include: {
            client: true
          }
        },
        order: true
      }
    });
  }

  async remove(id: string) {
    return this.prisma.cupones.delete({ where: { id } });
  }

  async registerUse(id: string, data: { clientId: string; orderId: string }) {
    const cupon = await this.prisma.cupones.findUnique({
      where: { id },
      include: { uses: true }
    });

    if (!cupon) {
      throw new NotFoundException('Cupón no encontrado');
    }

    if (cupon.maxUses && cupon.usedCount >= cupon.maxUses) {
      throw new BadRequestException('Cupón alcanzó el máximo de usos');
    }

    return this.prisma.cupones.update({
      where: { id },
      data: {
        usedCount: { increment: 1 },
        uses: {
          create: {
            clientId: data.clientId
          }
        },
        orderId: data.orderId
      },
      include: {
        uses: {
          include: {
            client: true
          }
        },
        order: true
      }
    });
  }
} 