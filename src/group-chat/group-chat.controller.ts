import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthUser } from 'src/decorators/user.decorator';
import { JwtPayload } from 'src/interfaces/jwt-payload.interface';
import { Role } from 'src/models/group-member.model';
import { CreateGroupDto } from './dto/create-croup.dto';
import { GroupDto } from './dto/group.dto';
import { GroupChatService } from './group-chat.service';
import { RolesGuard } from '../guards/roles.guard';
import { sendInvitationDto } from 'src/events/dto/send-invitation.dto';

@Controller('group-chat')
export class GroupChatController {
  constructor(private service: GroupChatService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getMyGroups(@AuthUser() user: JwtPayload): Promise<GroupDto[]> {
    return await this.service.getGroupsOfUser(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':groupId')
  async getGroup(@Param('groupId') groupId: string): Promise<GroupDto> {
    const group = await this.service.getGroup(groupId);
    if (!group) {
      throw new NotFoundException(`Group #${groupId} not found`);
    }
    return group;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createGroup(
    @AuthUser() user: JwtPayload,
    @Body() dto: CreateGroupDto,
  ): Promise<GroupDto> {
    const group = await this.service.createGroup(dto);
    await this.service.addMember({
      group: group._id,
      user: user.userId,
      role: Role.Admin,
    });
    const groupDto = await this.service.getGroup(group._id);
    return groupDto!!;
  }

  @UseGuards(JwtAuthGuard)
  @Post(':groupId')
  async joinGroup(
    @AuthUser() user: JwtPayload,
    @Param('groupId') groupId: string,
  ): Promise<GroupDto> {
    try {
      await this.service.addMember({
        group: groupId,
        user: user.userId,
        role: Role.Member,
      });
    } catch (e: unknown) {
      if (e instanceof Error) {
        throw new BadRequestException(e.message);
      }
    }
    const groupDto = await this.service.getGroup(groupId);
    if (!groupDto) {
      throw new NotFoundException(`Group #${groupId} not found`);
    }
    return groupDto;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post(':groupId/invite')
  async inviteToGroup(
    @AuthUser() sender: JwtPayload,
    @Param('groupId') groupId: string,
    @Body() dto: sendInvitationDto,
  ): Promise<GroupDto> {
    try {
      await this.service.inviteMember(
        sender.userId,
        dto.target,
        groupId,
        dto.sentAt,
      );
    } catch (e: unknown) {
      if (e instanceof Error) {
        throw new BadRequestException(e.message);
      }
    }
    const groupDto = await this.service.getGroup(groupId);
    if (!groupDto) {
      throw new NotFoundException(`Group #${groupId} not found`);
    }
    return groupDto;
  }
}
