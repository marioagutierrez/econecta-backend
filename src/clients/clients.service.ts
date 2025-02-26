import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto, UpdateClientDto } from './dto/client.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateClientDto) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.client.create({
      data: {
        ...data,
        password: hashedPassword
      }
    });
  }

  findAll() {
    return this.prisma.client.findMany();
  }

  async findOne(id: string) {
    const client = await this.prisma.client.findUnique({ 
      where: { id },
      include: {
        orders: {
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
        }
      }
    });
    if (!client) throw new NotFoundException('Cliente no encontrado');
    return client;
  }

  async update(id: string, data: UpdateClientDto) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return this.prisma.client.update({
      where: { id },
      data
    });
  }

  async remove(id: string) {
    return this.prisma.client.delete({ where: { id } });
  }
}
