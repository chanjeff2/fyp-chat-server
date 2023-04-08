import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { BlockService } from 'src/block/block.service';

@Injectable()
export class BlockedChatroomGuard implements CanActivate {
  constructor(
    @Inject(BlockService)
    private readonly blockService: BlockService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const recipientUserId = request.body.recipientUserId;
    const chatroomId: string = request.body.chatroomId;
    const isBlocked = await this.blockService.isBlocked(
      recipientUserId,
      chatroomId,
    );

    return !isBlocked;
  }
}
