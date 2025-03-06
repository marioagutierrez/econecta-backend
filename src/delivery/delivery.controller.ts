import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto, DeliveryZoneResponseDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('delivery')
@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva zona de entrega' })
  @ApiResponse({
    status: 201,
    description: 'Zona de entrega creada exitosamente',
    type: DeliveryZoneResponseDto
  })
  create(@Body() createDeliveryDto: CreateDeliveryDto) {
    return this.deliveryService.create(createDeliveryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las zonas de entrega (activas e inactivas)' })
  @ApiResponse({
    status: 200,
    description: 'Lista de todas las zonas de entrega',
    type: [DeliveryZoneResponseDto]
  })
  findAll() {
    return this.deliveryService.findAll(false);
  }

  @Get('live')
  @ApiOperation({ summary: 'Obtener solo las zonas de entrega activas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de zonas de entrega activas',
    type: [DeliveryZoneResponseDto]
  })
  findActive() {
    return this.deliveryService.findAll(true);
  }

  @Get('zona')
  @ApiOperation({ summary: 'Obtener tarifa por nombre de zona' })
  @ApiQuery({ name: 'nombre', description: 'Nombre de la zona' })
  @ApiResponse({
    status: 200,
    description: 'Información de la zona',
    type: DeliveryZoneResponseDto
  })
  findByZone(@Query('nombre') zona: string) {
    return this.deliveryService.findByZone(zona);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una zona de entrega por ID' })
  @ApiResponse({
    status: 200,
    description: 'Zona de entrega encontrada',
    type: DeliveryZoneResponseDto
  })
  findOne(@Param('id') id: string) {
    return this.deliveryService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una zona de entrega' })
  @ApiResponse({
    status: 200,
    description: 'Zona de entrega actualizada',
    type: DeliveryZoneResponseDto
  })
  update(@Param('id') id: string, @Body() updateDeliveryDto: UpdateDeliveryDto) {
    return this.deliveryService.update(id, updateDeliveryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar una zona de entrega' })
  @ApiResponse({
    status: 200,
    description: 'Zona de entrega desactivada',
    type: DeliveryZoneResponseDto
  })
  remove(@Param('id') id: string) {
    return this.deliveryService.remove(id);
  }
}
