import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GroupChatService } from 'src/group-chat/group-chat.service';
import { JwtPayload } from 'src/interfaces/jwt-payload.interface';
import { Role } from 'src/models/group-member.model';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(GroupChatService)
    private readonly groupChatService: GroupChatService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<Role[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user: JwtPayload = request.user;
    const groupId: string = request.params.groupId ?? request.params.chatroomId;
    const role = await this.groupChatService.getRoleOfMember(
      groupId,
      user.userId,
    );

    return role ? roles.includes(role) : false;
  }
}
