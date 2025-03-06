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

export class InvoiceDto {
  @ApiProperty({ example: 'V', description: 'Tipo de identificación' })
  buyerIdType: string;

  @ApiProperty({ example: '12345678', description: 'Número de identificación' })
  buyerIdNumber: string;

  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre del comprador' })
  buyerName: string;

  @ApiProperty({ example: 'Calle Principal #123', description: 'Dirección' })
  buyerAddress: string;

  @ApiProperty({ example: '1010', description: 'Ubicación/Código postal' })
  buyerLocation: string;

  @ApiProperty({ example: 'VE', description: 'País' })
  buyerCountry: string;

  @ApiProperty({ example: 'email', description: 'Método de notificación', required: false })
  buyerNotify?: string;

  @ApiProperty({ example: ['04141234567'], description: 'Teléfonos' })
  buyerPhones: string[];

  @ApiProperty({ example: ['juan@email.com'], description: 'Correos' })
  buyerEmails: string[];
}

export class CreateOrderDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID del cliente'
  })
  clientId: string;

  @ApiProperty({ type: [OrderItemDto], description: 'Items de la orden' })
  items: OrderItemDto[];

  @ApiProperty({ example: '29.99', description: 'Total de la orden' })
  total: Decimal;

  @ApiProperty({ example: '120.50', description: 'Total en bolívares' })
  totalBs: Decimal;

  @ApiProperty({ example: '4.50', description: 'Tasa BCV del día' })
  tasaBCV: Decimal;

  @ApiProperty({ example: '16', description: 'IVA de la orden' })
  IVA: Decimal;

  @ApiProperty({
    enum: ShippingMethod,
    example: 'DELIVERY',
    description: 'Método de envío'
  })
  shippingMethod: ShippingMethod;

  @ApiProperty({
    example: 'Calle Principal #123',
    description: 'Dirección de envío',
    required: false
  })
  shippingAddress?: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID del cupón',
    required: false
  })
  cuponId?: string;

  @ApiProperty({ type: InvoiceDto, required: false })
  invoice?: InvoiceDto;
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

export class UpdateOrderStatusDto {
  @ApiProperty({
    enum: OrderStatus,
    example: 'PROCESSING',
    description: 'Nuevo estado de la orden'
  })
  status: OrderStatus;
}
