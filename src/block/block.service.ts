import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Block, BlockDocument } from 'src/models/block.model';

@Injectable()
export class BlockService {
  constructor(
    @InjectModel(Block.name) private blockModel: Model<BlockDocument>,
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
}
