import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CuponesService } from './cupones.service';
import { CreateCuponDto, UpdateCuponDto } from './dto/cupon.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('cupones')
@Controller('cupones')
export class CuponesController {
  constructor(private readonly cuponesService: CuponesService) {}

  @ApiOperation({ summary: 'Crear nuevo cupón' })
  @ApiResponse({ status: 201, description: 'Cupón creado exitosamente' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createCuponDto: CreateCuponDto) {
    return this.cuponesService.create(createCuponDto);
  }

  @ApiOperation({ summary: 'Obtener todos los cupones' })
  @ApiResponse({ status: 200, description: 'Lista de cupones' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.cuponesService.findAll();
  }

  @ApiOperation({ summary: 'Obtener cupón por código' })
  @ApiResponse({ status: 200, description: 'Cupón encontrado' })
  @ApiResponse({ status: 404, description: 'Cupón no encontrado' })
  @Get('codigo/:codigo')
  findByCodigo(@Param('codigo') codigo: string) {
    return this.cuponesService.findByCodigo(codigo);
  }

  @ApiOperation({ summary: 'Obtener cupón por ID' })
  @ApiResponse({ status: 200, description: 'Cupón encontrado' })
  @ApiResponse({ status: 404, description: 'Cupón no encontrado' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cuponesService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar cupón' })
  @ApiResponse({ status: 200, description: 'Cupón actualizado exitosamente' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCuponDto: UpdateCuponDto) {
    return this.cuponesService.update(id, updateCuponDto);
  }

  @ApiOperation({ summary: 'Eliminar cupón' })
  @ApiResponse({ status: 200, description: 'Cupón eliminado exitosamente' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cuponesService.remove(id);
  }
} 