import { CreateWidgetRequest, CreateWidgetResponse } from '@letyca/contracts';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('widgets')
export class WidgetController {
  @Post()
  async createWidget(
    @Body() req: CreateWidgetRequest,
  ): Promise<CreateWidgetResponse> {
    console.log(req);
    return {
      id: '123',
    };
  }
}
