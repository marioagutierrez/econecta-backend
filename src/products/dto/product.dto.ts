import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';

export class ProductVariantDto {
  @ApiProperty({ example: 'Talla L', description: 'Nombre de la variante' })
  name: string;

  @ApiProperty({
    example: 'Talla grande',
    description: 'Descripción de la variante',
    required: false,
  })
  description?: string;

  @ApiProperty({ example: 10, description: 'Cantidad en stock' })
  stock: number;

  @ApiProperty({
    example: 'https://imagen.jpg',
    description: 'URL de la imagen',
    required: false,
  })
  imageUrl?: string;
}

export class CreateProductDto {
  @ApiProperty({ example: 'Camiseta', description: 'Nombre del producto' })
  name: string;

  @ApiProperty({
    example: 'Camiseta de algodón',
    description: 'Descripción del producto',
    required: false,
  })
  description?: string;

  @ApiProperty({ example: '29.99', description: 'Precio del producto' })
  price: Decimal;

  @ApiProperty({ example: 100, description: 'Cantidad en stock' })
  stock: number;

  @ApiProperty({
    example: 'https://imagen.jpg',
    description: 'URL de la imagen',
    required: false,
  })
  imageUrl?: string;

  @ApiProperty({ example: true, description: '¿El producto tiene variantes?' })
  hasVariants: boolean;

  @ApiProperty({ type: [ProductVariantDto], required: false })
  variants?: ProductVariantDto[];
}

export class UpdateProductDto {
  @ApiProperty({
    example: 'Camiseta',
    description: 'Nombre del producto',
    required: false,
  })
  name?: string;

  @ApiProperty({
    example: 'Camiseta de algodón',
    description: 'Descripción del producto',
    required: false,
  })
  description?: string;

  @ApiProperty({
    example: '29.99',
    description: 'Precio del producto',
    required: false,
  })
  price?: Decimal;

  @ApiProperty({
    example: 100,
    description: 'Cantidad en stock',
    required: false,
  })
  stock?: number;

  @ApiProperty({
    example: 'https://imagen.jpg',
    description: 'URL de la imagen',
    required: false,
  })
  imageUrl?: string;

  @ApiProperty({
    example: true,
    description: '¿El producto tiene variantes?',
    required: false,
  })
  hasVariants?: boolean;

  @ApiProperty({ type: [ProductVariantDto], required: false })
  variants?: ProductVariantDto[];
}
