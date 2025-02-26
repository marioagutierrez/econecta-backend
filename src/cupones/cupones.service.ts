import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCuponDto, UpdateCuponDto } from './dto/cupon.dto';

@Injectable()
export class CuponesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCuponDto) {
    return this.prisma.cupones.create({
      data
    });
  }

  async findAll() {
    return this.prisma.cupones.findMany({
      include: {
        usedBy: true,
        order: true
      }
    });
  }

  async findOne(id: string) {
    const cupon = await this.prisma.cupones.findUnique({
      where: { id },
      include: {
        usedBy: true,
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
        usedBy: true,
        order: true
      }
    });
    if (!cupon) throw new NotFoundException('Cupón no encontrado');
    if (cupon.usedAt) throw new BadRequestException('Cupón ya utilizado');
    if (cupon.maturyAt && cupon.maturyAt < new Date()) {
      throw new BadRequestException('Cupón vencido');
    }
    return cupon;
  }

  async update(id: string, data: UpdateCuponDto) {
    return this.prisma.cupones.update({
      where: { id },
      data,
      include: {
        usedBy: true,
        order: true
      }
    });
  }

  async remove(id: string) {
    return this.prisma.cupones.delete({ where: { id } });
  }
} 