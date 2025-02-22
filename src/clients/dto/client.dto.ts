import { ApiProperty } from '@nestjs/swagger';
import { ClientType } from '@prisma/client';

class BaseClientDto {
  @ApiProperty({ example: 'juan@email.com', description: 'Email del cliente' })
  email: string;

  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre completo' })
  name: string;

  @ApiProperty({ example: 'juanperez', description: 'Nombre de usuario' })
  username: string;

  @ApiProperty({ example: '123456', description: 'Contraseña' })
  password: string;

  @ApiProperty({
    enum: ClientType,
    example: 'PERSONAL',
    description: 'Tipo de cliente (PERSONAL o EMPRESA)',
  })
  type: ClientType;

  @ApiProperty({ example: 'V12345678', description: 'Documento de identidad' })
  document: string;

  @ApiProperty({ example: 'Caracas, Venezuela', description: 'Dirección' })
  address: string;

  @ApiProperty({ example: '04141234567', description: 'Teléfono' })
  phone: string;
}

export class CreateClientDto extends BaseClientDto {}

export class UpdateClientDto implements Partial<BaseClientDto> {
  @ApiProperty({ required: false })
  email?: string;

  @ApiProperty({ required: false })
  password?: string;

  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  username?: string;

  @ApiProperty({ required: false })
  type?: ClientType;

  @ApiProperty({ required: false })
  document?: string;

  @ApiProperty({ required: false })
  address?: string;

  @ApiProperty({ required: false })
  phone?: string;
}
