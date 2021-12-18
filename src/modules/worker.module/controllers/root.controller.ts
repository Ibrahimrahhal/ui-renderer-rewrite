import { Controller, Get } from '@nestjs/common';

@Controller('/')
export class CatsController {
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}
