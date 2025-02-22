import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiExcludeController, ApiProperty } from '@nestjs/swagger';

export class HelloResponse {
  @ApiProperty({
    example: 'Hello World!',
    description: 'Mensaje de bienvenida',
  })
  message: string;
}

@ApiExcludeController()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): HelloResponse {
    return { message: this.appService.getHello() };
  }
}
