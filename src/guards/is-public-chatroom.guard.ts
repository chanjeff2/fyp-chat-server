import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { GroupChatService } from 'src/group-chat/group-chat.service';

@Injectable()
export class IsPublicChatroomGuard implements CanActivate {
  constructor(
    @Inject(GroupChatService)
    private readonly groupChatService: GroupChatService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const groupId: string = request.params.groupId ?? request.params.chatroomId;
    const isPublic = await this.groupChatService.isPublic(groupId);

    return isPublic;
  }
}
