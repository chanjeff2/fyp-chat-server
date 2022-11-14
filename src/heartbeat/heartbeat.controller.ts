import { Controller, Get } from '@nestjs/common';

@Controller('heartbeat')
export class HeartbeatController {
  @Get()
  async heatbeat() {
    return 'OK';
  }
}
