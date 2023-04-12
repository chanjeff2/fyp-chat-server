import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthUser } from 'src/decorators/user.decorator';
import { JwtPayload } from 'src/interfaces/jwt-payload.interface';
import { Role } from 'src/models/group-member.model';
import { CreateGroupDto } from './dto/create-group.dto';
import { GroupDto } from './dto/group.dto';
import { GroupChatService } from './group-chat.service';
import { RolesGuard } from '../guards/roles.guard';
import { GroupMemberDto } from './dto/group-member.dto';
import { SendAccessControlDto } from './dto/send-access-control.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Patch(':groupId')
  async patchGroup(
    @Param('groupId') groupId: string,
    @Body() dto: UpdateGroupDto,
  ): Promise<GroupDto> {
    await this.service.patchGroup(groupId, dto);
    const groupDto = await this.service.getGroup(groupId);
    if (!groupDto) {
      // how??
      throw new NotFoundException(`group #${groupId} not found.`);
    }
    return groupDto;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':groupId/member/:userId')
  async getGroupMember(
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
  ): Promise<GroupMemberDto> {
    const groupMember = await this.service.getGroupMemberDto(groupId, userId);
    if (!groupMember) {
      throw new NotFoundException(
        `Group member #${userId} in group #${groupId} not found`,
      );
    }
    return groupMember;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createGroup(
    @AuthUser() user: JwtPayload,
    @Body() dto: CreateGroupDto,
  ): Promise<GroupDto> {
    const group = await this.service.createGroup(dto);
    await this.service.addMember({
      chatroomId: group._id,
      userId: user.userId,
      role: Role.Admin,
    });
    const groupDto = await this.service.getGroup(group._id);
    return groupDto!!;
  }

  // @UseGuards(JwtAuthGuard)
  // @Post(':groupId/join')
  // async joinGroup(
  //   @AuthUser() user: JwtPayload,
  //   @Param('groupId') groupId: string,
  // ): Promise<GroupDto> {
  //   try {
  //     await this.service.addMember({
  //       group: groupId,
  //       user: user.userId,
  //       role: Role.Member,
  //     });
  //   } catch (e: unknown) {
  //     if (e instanceof Error) {
  //       throw new BadRequestException(e.message);
  //     }
  //   }
  //   const groupDto = await this.service.getGroup(groupId);
  //   if (!groupDto) {
  //     throw new NotFoundException(`Group #${groupId} not found`);
  //   }
  //   return groupDto;
  // }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Post(':groupId/leave')
  async leaveGroup(
    @AuthUser() user: JwtPayload,
    @Param('groupId') groupId: string,
  ): Promise<void> {
    await this.service.removeMember(user.userId, groupId);
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post(':groupId/access-control')
  async accessControl(
    @AuthUser() sender: JwtPayload,
    @Param('groupId') groupId: string,
    @Body() dto: SendAccessControlDto,
  ): Promise<GroupDto> {
    await this.service.accessControl(sender.userId, groupId, dto);
    const groupDto = await this.service.getGroup(groupId);
    if (!groupDto) {
      throw new NotFoundException(`Group #${groupId} not found`);
    }
    return groupDto;
  }
}
