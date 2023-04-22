import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
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
import { GroupInfoDto } from './dto/group-info.dto';
import { IsPublicChatroomGuard } from 'src/guards/is-public-chatroom.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { SyncGroupDto } from './dto/sync-group.dto';

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
  @Get(':groupId/info')
  async getGroupInfo(@Param('groupId') groupId: string): Promise<GroupInfoDto> {
    const group = await this.service.getGroupInfo(groupId);
    if (!group) {
      throw new NotFoundException(`Group #${groupId} not found`);
    }
    return group;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Patch(':groupId')
  async patchGroup(
    @AuthUser() user: JwtPayload,
    @Param('groupId') groupId: string,
    @Body() dto: UpdateGroupDto,
  ): Promise<GroupInfoDto> {
    await this.service.patchGroup(user.userId, groupId, dto);
    const groupInfoDto = await this.service.getGroupInfo(groupId);
    if (!groupInfoDto) {
      // how??
      throw new NotFoundException(`group #${groupId} not found.`);
    }
    return groupInfoDto;
  }

  @Put(':groupId/update-profile-pic')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async updateProfilePic(
    @AuthUser() user: JwtPayload,
    @Param('groupId') groupId: string,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png)$/,
        })
        .addMaxSizeValidator({ maxSize: 10485760 })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ): Promise<GroupInfoDto> {
    await this.service.uploadProfilePic(user.userId, groupId, file);
    const groupInfoDto = await this.service.getGroupInfo(groupId);
    if (!groupInfoDto) {
      // how??
      throw new NotFoundException(`group #${groupId} not found.`);
    }
    return groupInfoDto;
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

  @UseGuards(JwtAuthGuard, IsPublicChatroomGuard)
  @Post(':groupId/join')
  async joinGroup(
    @AuthUser() user: JwtPayload,
    @Param('groupId') groupId: string,
  ): Promise<void> {
    await this.service.memberJoin(user.userId, groupId);
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Post(':groupId/leave')
  async leaveGroup(
    @AuthUser() user: JwtPayload,
    @Param('groupId') groupId: string,
  ): Promise<void> {
    await this.service.memberLeave(user.userId, groupId);
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

  @Post('sync')
  async synchronize(
    @Body('data') data: SyncGroupDto[],
  ): Promise<GroupInfoDto[]> {
    const groups = await this.service.synchronize(data);
    return groups.map((group) => GroupInfoDto.from(group));
  }
}
