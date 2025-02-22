import { ApiProperty } from '@nestjs/swagger';

export class BcvRateResponse {
  @ApiProperty({ example: '35.96', description: 'Tasa del BCV actual' })
  rate: string;

  @ApiProperty({ example: '2024-03-14', description: 'Fecha de la tasa' })
  date: string;
}
