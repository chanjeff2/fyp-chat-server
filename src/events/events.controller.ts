import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { AuthUser } from 'src/decorators/user.decorator';
import { JwtPayload } from 'src/interfaces/jwt-payload.interface';
import { SendMessageDto } from './dto/send-message.dto';
import { SendMessageResponse } from './dto/send-message.response.dto';
import { EventsService } from './events.service';
import { BlockedChatroomGuard } from 'src/guards/blocked-chatroom.guard';

@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Post('message')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard, BlockedChatroomGuard)
  async sendMessage(
    @AuthUser() user: JwtPayload,
    @Body() sendMessageDto: SendMessageDto,
  ): Promise<SendMessageResponse> {
    return await this.eventsService.sendMessage(user.userId, sendMessageDto);
  }
}
