import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus, ShippingMethod } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class OrderItemDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID del producto',
  })
  productId: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID de la variante',
    required: false,
  })
  variantId?: string;

  @ApiProperty({ example: 2, description: 'Cantidad del producto' })
  quantity: number;

  @ApiProperty({ example: '29.99', description: 'Precio del producto' })
  price: Decimal;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID de la empresa',
    required: false,
  })
  empresaId?: string;
}

export class CreateOrderDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID del cliente',
  })
  clientId: string;

  @ApiProperty({ type: [OrderItemDto], description: 'Items de la orden' })
  items: OrderItemDto[];

  @ApiProperty({
    enum: ['DELIVERY', 'PICKUP', 'ENCOMIENDA'],
    enumName: 'ShippingMethod',
    example: 'DELIVERY',
    description: 'Método de envío'
  })
  shippingMethod: ShippingMethod;

  @ApiProperty({
    example: 'Calle Principal #123, Ciudad',
    description: 'Dirección de envío',
    required: false
  })
  shippingAddress?: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID del cupón',
    required: false,
  })
  cuponId?: string;
}

export class UpdateOrderDto {
  @ApiProperty({
    enum: OrderStatus,
    example: 'COMPLETED',
    description: 'Estado de la orden',
    required: false,
  })
  status?: OrderStatus;

  @ApiProperty({
    enum: ['DELIVERY', 'PICKUP', 'ENCOMIENDA'],
    enumName: 'ShippingMethod',
    example: 'DELIVERY',
    description: 'Método de envío',
    required: false
  })
  shippingMethod?: ShippingMethod;

  @ApiProperty({
    example: 'Calle Principal #123, Ciudad',
    description: 'Dirección de envío',
    required: false
  })
  shippingAddress?: string;

  @ApiProperty({
    type: [OrderItemDto],
    description: 'Items de la orden',
    required: false,
  })
  items?: OrderItemDto[];

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID del cupón',
    required: false,
  })
  cuponId?: string;
}
