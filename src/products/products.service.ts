import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateProductDto) {
    const { variants, ...productData } = data;
    return this.prisma.product.create({
      data: {
        ...productData,
        variants:
          variants && variants.length > 0
            ? {
                create: variants
              }
            : undefined
      },
      include: {
        variants: true
      }
    });
  }

  async findAll(params?: {
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    excludeId?: string;
  }) {
    const where: Prisma.ProductWhereInput = {};

    // Filtro por búsqueda en nombre o descripción
    if (params?.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } }
      ];
    }

    // Filtro por rango de precios
    if (params?.minPrice || params?.maxPrice) {
      where.price = {};
      if (params.minPrice) {
        where.price.gte = params.minPrice;
      }
      if (params.maxPrice) {
        where.price.lte = params.maxPrice;
      }
    }

    // Excluir producto por ID
    if (params?.excludeId) {
      where.id = { not: params.excludeId };
    }

    return this.prisma.product.findMany({
      where,
      include: {
        variants: true
      }
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        variants: true
      }
    });
    if (!product) throw new NotFoundException('Producto no encontrado');
    return product;
  }

  async update(id: string, data: UpdateProductDto) {
    const { variants, ...productData } = data;
    if (variants) {
      // Primero eliminamos las variantes existentes
      await this.prisma.productVariant.deleteMany({
        where: { productId: id }
      });
      // Luego actualizamos el producto y creamos las nuevas variantes
      return this.prisma.product.update({
        where: { id },
        data: {
          ...productData,
          variants: {
            create: variants
          }
        },
        include: {
          variants: true
        }
      });
    }

    return this.prisma.product.update({
      where: { id },
      data: productData,
      include: {
        variants: true
      }
    });
  }

  async remove(id: string) {
    return this.prisma.product.delete({ where: { id } });
  }
}
