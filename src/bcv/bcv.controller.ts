import { Controller, Get } from '@nestjs/common';
import { BcvService } from './bcv.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BcvRateResponse } from './dto/bcv.dto';

@ApiTags('bcv')
@Controller('bcv')
export class BcvController {
  constructor(private readonly bcvService: BcvService) {}

  @ApiOperation({ summary: 'Obtener tasa actual del BCV' })
  @ApiResponse({
    status: 200,
    description: 'Tasa del BCV obtenida exitosamente',
    type: BcvRateResponse,
  })
  @ApiResponse({
    status: 503,
    description: 'Servicio del BCV no disponible',
  })
  @Get('rate')
  async getTasaBCV(): Promise<BcvRateResponse> {
    const rate = await this.bcvService.getTasaBCV();
    return {
      rate: rate.toString(),
      date: new Date().toISOString().split('T')[0],
    };
  }
}
