import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';
import { Decimal } from '@prisma/client/runtime/library';

export class CreateDeliveryDto {
  @ApiProperty({
    example: 'Zona Norte',
    description: 'Nombre de la zona de entrega'
  })
  @IsString()
  zona: string;

  @ApiProperty({
    example: 5.99,
    description: 'Tarifa de entrega para la zona'
  })
  @IsNumber()
  tarifa: Decimal;

  @ApiProperty({
    example: 'user123',
    description: 'ID del usuario que crea la zona'
  })
  @IsString()
  createdBy: string;

  @ApiProperty({
    example: true,
    description: 'Estado de la zona de entrega',
    default: true
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class DeliveryZoneResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  id: string;

  @ApiProperty({
    example: 'Zona Norte'
  })
  zona: string;

  @ApiProperty({
    example: 5.99
  })
  tarifa: Decimal;

  @ApiProperty({
    example: '2024-03-14T12:00:00Z'
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-03-14T12:00:00Z'
  })
  updatedAt: Date;

  @ApiProperty({
    example: true
  })
  isActive: boolean;
}
