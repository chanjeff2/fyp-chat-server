import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Block, BlockDocument } from 'src/models/block.model';
import { TrustWorthyDto } from './dto/trust-worthy.dto';

@Injectable()
export class BlockService {
  constructor(
    @InjectModel(Block.name) private blockModel: Model<BlockDocument>,
    private configService: ConfigService,
  ) {}

  async blockChatroom(me: string, chatroomId: string): Promise<Block> {
    const exists = await this.blockModel.exists({
      userId: me,
      chatroomId: chatroomId,
    });
    if (exists) {
      throw new Error(`already blocked chatroom #${chatroomId}`);
    }
    return await this.blockModel.create({
      userId: me,
      chatroomId: chatroomId,
    });
  }

  async unblockChatroom(me: string, chatroomId: string): Promise<Block | null> {
    return await this.blockModel.findOneAndDelete({
      userId: me,
      chatroomId: chatroomId,
    });
  }

  async getAllBlockedChatrooms(me: string): Promise<string[]> {
    const blocks = await this.blockModel.find({
      userId: me,
    });
    return blocks.map((block) => block.chatroomId);
  }

  async isBlocked(me: string, chatroomId: string): Promise<boolean> {
    const exists = await this.blockModel.exists({
      userId: me,
      chatroomId: chatroomId,
    });
    return exists != null;
  }

  async getAmountOfBlocks(chatroomId: string): Promise<number> {
    return await this.blockModel.count({
      chatroomId: chatroomId,
    });
  }

  async isChatroomTrustWorthy(chatroomId: string): Promise<TrustWorthyDto> {
    const count = await this.getAmountOfBlocks(chatroomId);
    const threshold = this.configService.get<number>('BLOCK_AMOUNT') ?? 1;
    const dto = new TrustWorthyDto();
    dto.chatroomId = chatroomId;
    dto.isTrustWorthy = count < threshold;
    return dto;
  }
}
