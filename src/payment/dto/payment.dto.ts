import { ApiProperty } from '@nestjs/swagger';

export class GenerateOtpDto {
  @ApiProperty({ example: '0105', description: 'Código del banco' })
  banco: string;

  @ApiProperty({ example: '100.00', description: 'Monto de la transacción' })
  monto: string;

  @ApiProperty({ example: '04141234567', description: 'Número de teléfono' })
  telefono: string;

  @ApiProperty({ example: 'V12345678', description: 'Cédula del cliente' })
  cedula: string;
}

export class DebitoInmediatoDto extends GenerateOtpDto {
  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre del cliente' })
  nombre: string;

  @ApiProperty({ example: '123456', description: 'Código OTP' })
  otp: string;

  @ApiProperty({
    example: 'Pago de servicio',
    description: 'Concepto del pago',
  })
  concepto: string;
}

export class OtpResponse {
  @ApiProperty({ example: '202', description: 'Código de respuesta' })
  code: string;

  @ApiProperty({
    example: 'OTP generado exitosamente',
    description: 'Mensaje de respuesta',
  })
  message: string;

  @ApiProperty({ example: true, description: 'Indicador de éxito' })
  success: boolean;
}

export class DebitoResponse {
  @ApiProperty({ example: 'ACCP', description: 'Código de respuesta' })
  code: string;

  @ApiProperty({
    example: 'Pago procesado exitosamente',
    description: 'Mensaje de respuesta',
  })
  message: string;

  @ApiProperty({ example: 'REF123456', description: 'Referencia del pago' })
  reference: string;
}
