import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthUser } from 'src/decorators/user.decorator';
import { JwtPayload } from 'src/interfaces/jwt-payload.interface';
import { Role } from 'src/models/group-member.model';
import { CreateGroupDto } from './dto/create-croup.dto';
import { GroupDto } from './dto/group.dto';
import { JoinGroupDto } from './dto/join-group.dto';
import { GroupChatService } from './group-chat.service';

@Controller('group-chat')
export class GroupChatController {
  constructor(private service: GroupChatService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':groupId')
  async getGroup(
    @AuthUser() user: JwtPayload,
    @Param('groupId') groupId: string,
  ): Promise<GroupDto> {
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
    const me = await this.service.addMember({
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
      const groupMember = await this.service.addMember({
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
}
