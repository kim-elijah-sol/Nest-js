import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

type TestResponse = {
  id: number
  name: string
  job: string
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/test')
  getTest(@Query('id') id: string): TestResponse {
    return {
      id: parseInt(id),
      name: 'kim-elijah-sol',
      job: 'FrontEnd Engineer'
    }
  }
}
