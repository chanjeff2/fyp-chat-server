import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthUser } from 'src/decorators/user.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { JwtPayload } from 'src/interfaces/jwt-payload.interface';
import { BlockService } from './block.service';
import { TrustWorthyDto } from './dto/trust-worthy.dto';

@Controller('block')
export class BlockController {
  constructor(private service: BlockService) {}

  @Post(':chatroomId')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async blockChatroom(
    @AuthUser() user: JwtPayload,
    @Param('chatroomId') chatroomId: string,
  ): Promise<void> {
    await this.service.blockChatroom(user.userId, chatroomId);
  }

  @Delete(':chatroomId')
  @UseGuards(JwtAuthGuard)
  async unblockChatroom(
    @AuthUser() user: JwtPayload,
    @Param('chatroomId') chatroomId: string,
  ): Promise<void> {
    const block = await this.service.unblockChatroom(user.userId, chatroomId);
    if (block == null) {
      throw new NotFoundException(
        `block history for chatroom #${chatroomId} not found`,
      );
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllBlockedChatrooms(
    @AuthUser() user: JwtPayload,
  ): Promise<string[]> {
    return this.service.getAllBlockedChatrooms(user.userId);
  }

  @Get(':chatroomId/trustworthy')
  async isChatroomTrustWorthy(
    @Param('chatroomId') chatroomId: string,
  ): Promise<TrustWorthyDto> {
    return await this.service.isChatroomTrustWorthy(chatroomId);
  }
}
