import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';

export class CreateCuponDto {
  @ApiProperty({
    example: 'SUMMER2024',
    description: 'Código del cupón'
  })
  codigo: string;

  @ApiProperty({
    example: '10.00',
    description: 'Monto del descuento'
  })
  descuento: Decimal;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID del creador del cupón'
  })
  createdBy: string;

  @ApiProperty({
    example: 5,
    description: 'Número máximo de usos (null para ilimitado)',
    required: false
  })
  maxUses?: number;

  @ApiProperty({
    example: '2024-12-31T23:59:59Z',
    description: 'Fecha de vencimiento',
    required: false
  })
  maturyAt?: Date;
}

export class UpdateCuponDto {
  @ApiProperty({
    example: '2024-12-31T23:59:59Z',
    description: 'Fecha de vencimiento',
    required: false
  })
  maturyAt?: Date;

  @ApiProperty({
    example: 5,
    description: 'Número máximo de usos',
    required: false
  })
  maxUses?: number;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID de la orden donde se usó el cupón',
    required: false
  })
  orderId?: string;
} 