import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FCMEventType } from 'src/enums/fcm-event-type.enum';
import { FCMEvent } from 'src/events/dto/fcm-event';
import { EventsService } from 'src/events/events.service';
import {
  GroupMember,
  GroupMemberDocument,
  Role,
} from 'src/models/group-member.model';
import { Group, GroupDocument } from 'src/models/group.model';
import { UserProfileDto } from 'src/users/dto/user-profile.dto';
import { UsersService } from 'src/users/users.service';
import { AccessControlDto } from './dto/access-control.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { GroupInfoDto } from './dto/group-info.dto';
import { GroupMemberDto } from './dto/group-member.dto';
import { GroupPatchEventDto } from './dto/group-patch-event.dto';
import { GroupDto } from './dto/group.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { MemberJoinLeaveEventDto } from './dto/member-join-leave-event.dto';
import { SendAccessControlDto } from './dto/send-access-control.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupChatService {
  constructor(
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
    @InjectModel(GroupMember.name)
    private groupMemberModel: Model<GroupMemberDocument>,
    private usersService: UsersService,
    private eventsService: EventsService,
  ) {}

  async isGroupExists(id: string): Promise<boolean> {
    const doc = await this.groupModel.exists({ _id: id });
    return doc != null;
  }

  async createGroup(createGroupDto: CreateGroupDto): Promise<Group> {
    return await this.groupModel.create(createGroupDto);
  }

  /// will send invitation to device
  async accessControl(
    senderUserId: string,
    chatroomId: string,
    dto: SendAccessControlDto,
  ) {
    // perform access control event
    switch (dto.type) {
      case FCMEventType.AddMember:
        await this.addMember({
          userId: dto.targetUserId,
          chatroomId: chatroomId,
          role: Role.Member,
        });
        break;
      case FCMEventType.KickMember:
        await this.removeMember(dto.targetUserId, chatroomId);
        break;
      case FCMEventType.PromoteAdmin:
        await this.updateRole(dto.targetUserId, chatroomId, Role.Admin);
        break;
      case FCMEventType.DemoteAdmin:
        await this.updateRole(dto.targetUserId, chatroomId, Role.Member);
        break;
      default:
        break;
    }
    // broadcast the event to every member in the group
    const event = new AccessControlDto();
    event.type = dto.type;
    event.senderUserId = senderUserId;
    event.targetUserId = dto.targetUserId;
    event.chatroomId = chatroomId;
    event.sentAt = dto.sentAt;
    await this.broadcastEvent(senderUserId, event);
  }

  private async broadcastEvent(chatroomId: string, event: FCMEvent) {
    // broadcast the event to every member in the group
    const members = await this.getMembersOfGroup(chatroomId);
    await Promise.all(
      members.map(async (member) => {
        await this.eventsService.sendEvent(member._id, event);
      }),
    );
  }

  /// will NOT send invitation to device
  async addMember(dto: AddMemberDto): Promise<GroupMember> {
    const exists = await this.groupMemberModel.exists({
      user: dto.userId,
      group: dto.chatroomId,
    });
    if (exists) {
      throw new BadRequestException('already joined group');
    }
    const userExists = await this.usersService.isUserExist(dto.userId);
    if (!userExists) {
      throw new NotFoundException('user not found');
    }
    const chatroomExists = await this.isGroupExists(dto.chatroomId);
    if (!chatroomExists) {
      throw new NotFoundException('chatroom not found');
    }
    return await this.groupMemberModel.create({
      user: dto.userId,
      group: dto.chatroomId,
      role: dto.role,
    });
  }

  /// will send notificiation to device
  async memberJoin(userId: string, chatroomId: string): Promise<void> {
    await this.addMember({
      userId: userId,
      chatroomId: chatroomId,
      role: Role.Member,
    });
    // broadcast the event to every member in the group
    const event = new MemberJoinLeaveEventDto();
    event.type = FCMEventType.MemberJoin;
    event.senderUserId = userId;
    event.chatroomId = chatroomId;
    event.sentAt = new Date().toISOString();
    await this.broadcastEvent(userId, event);
  }

  // will send notificiation to device
  async memberLeave(userId: string, chatroomId: string): Promise<void> {
    await this.removeMember(userId, chatroomId);
    // broadcast the event to every member in the group
    const event = new MemberJoinLeaveEventDto();
    event.type = FCMEventType.MemberLeave;
    event.senderUserId = userId;
    event.chatroomId = chatroomId;
    event.sentAt = new Date().toISOString();
    await this.broadcastEvent(userId, event);
  }

  // will NOT send notification to device
  async removeMember(userId: string, chatroomId: string): Promise<void> {
    const member = await this.groupMemberModel.deleteOne({
      user: userId,
      group: chatroomId,
    });
    if (member.deletedCount == 0) {
      throw new NotFoundException('group member not found');
    }
  }

  async updateRole(
    userId: string,
    chatroomId: string,
    role: Role,
  ): Promise<GroupMember | null> {
    const member = await this.groupMemberModel.findOneAndUpdate(
      {
        user: userId,
        group: chatroomId,
      },
      {
        role: role,
      },
      { new: true },
    );
    if (member == null) {
      throw new NotFoundException('group member not found');
    }
    return member;
  }

  async getGroupInfo(groupId: string): Promise<GroupInfoDto | null> {
    const group = await this.groupModel.findById(groupId);
    if (!group) {
      return null;
    }
    return GroupInfoDto.from(group);
  }

  async getGroup(groupId: string): Promise<GroupDto | null> {
    const group = await this.groupModel.findById(groupId);
    if (!group) {
      return null;
    }
    const members = await this.getMembersOfGroup(groupId);
    const memberDtos = await Promise.all(
      members.map(async (member) => {
        const user = await this.usersService.getUserById(member.user as string);
        if (!user) {
          return null;
        }
        const profile = UserProfileDto.from(user);
        const groupMemberDto = new GroupMemberDto();
        groupMemberDto.user = profile;
        groupMemberDto.role = member.role;
        return groupMemberDto;
      }),
    );
    const groupDto = GroupDto.fromMembers(
      group,
      memberDtos.filter((e): e is GroupMemberDto => e !== null),
    );
    groupDto.createdAt = group.createdAt.toISOString();
    return groupDto;
  }

  async patchGroup(
    userId: string,
    groupId: string,
    dto: UpdateGroupDto,
  ): Promise<Group> {
    const group = await this.groupModel.findByIdAndUpdate(groupId, dto, {
      new: true,
    });
    if (!group) {
      throw new NotFoundException(`group #${groupId} not found.`);
    }
    const event = new GroupPatchEventDto();
    event.type = FCMEventType.PatchGroup;
    event.senderUserId = userId;
    event.chatroomId = groupId;
    event.sentAt = new Date().toISOString();
    this.broadcastEvent(groupId, event);
    return group;
  }

  /// return members of a group given group Id
  async getMembersOfGroup(groupId: string): Promise<GroupMember[]> {
    return await this.groupMemberModel.find({ group: groupId });
  }

  async getGroupsOfUser(userId: string): Promise<GroupDto[]> {
    const groupMembers = await this.groupMemberModel.find({ user: userId });
    const groups = await Promise.all(
      groupMembers.map((e) => this.getGroup(e.group as string)),
    );
    return groups.filter((e): e is GroupDto => e !== null);
  }

  async getGroupMember(
    groupId: string,
    userId: string,
  ): Promise<GroupMember | null> {
    const member = await this.groupMemberModel.findOne({
      group: groupId,
      user: userId,
    });
    return member;
  }

  async getGroupMemberDto(
    groupId: string,
    userId: string,
  ): Promise<GroupMemberDto | null> {
    const member = await this.groupMemberModel.findOne({
      group: groupId,
      user: userId,
    });
    if (member == null) {
      return null;
    }
    const dto = new GroupMemberDto();
    const user = await this.usersService.getUserById(member.user as string);
    if (user == null) {
      return null;
    }
    dto.user = UserProfileDto.from(user);
    dto.role = member.role;
    return dto;
  }

  async isPublic(groupId: string): Promise<boolean> {
    const group = await this.groupModel.findById(groupId);
    return group?.isPublic ?? false;
  }

  async getRoleOfMember(groupId: string, userId: string): Promise<Role | null> {
    const member = await this.getGroupMember(groupId, userId);
    return member?.role ?? null;
  }
}
