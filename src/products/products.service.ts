import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
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

  findAll() {
    return this.prisma.product.findMany({
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
