import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventsService } from 'src/events/events.service';
import {
  GroupMember,
  GroupMemberDocument,
  Role,
} from 'src/models/group-member.model';
import { Group, GroupDocument } from 'src/models/group.model';
import { UserProfileDto } from 'src/users/dto/user-profile.dto';
import { UsersService } from 'src/users/users.service';
import { CreateGroupDto } from './dto/create-croup.dto';
import { GroupMemberDto } from './dto/group-member.dto';
import { GroupDto } from './dto/group.dto';
import { JoinGroupDto } from './dto/join-group.dto';

@Injectable()
export class GroupChatService {
  constructor(
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
    @InjectModel(GroupMember.name)
    private groupMemberModel: Model<GroupMemberDocument>,
    private usersService: UsersService,
    private eventsService: EventsService,
  ) {}

  async createGroup(createGroupDto: CreateGroupDto): Promise<Group> {
    return await this.groupModel.create(createGroupDto);
  }

  // will send invitation to device
  async inviteMember(
    senderUserId: string,
    recipientUserId: string,
    chatroomId: string,
    sentAt: string,
  ): Promise<GroupMember> {
    let member = await this.addMember({
      user: recipientUserId,
      group: chatroomId,
      role: Role.Member,
    });
    await this.eventsService.sendInvitation(
      senderUserId,
      recipientUserId,
      chatroomId,
      sentAt,
    );
    return member;
  }

  // will NOT send invitation to device
  async addMember(dto: JoinGroupDto): Promise<GroupMember> {
    const exists = await this.groupMemberModel.exists({
      user: dto.user,
      group: dto.group,
    });
    if (exists) {
      throw new Error('already joined group');
    }
    return await this.groupMemberModel.create(dto);
  }

  async getGroup(groupId: string): Promise<GroupDto | null> {
    const group = await this.groupModel.findById(groupId);
    if (!group) {
      return null;
    }
    const members = await this.groupMemberModel.find({ group: groupId });
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
    const groupDto = new GroupDto();
    groupDto._id = group._id;
    groupDto.name = group.name;
    groupDto.members = memberDtos.filter(
      (e): e is GroupMemberDto => e !== null,
    );
    groupDto.createdAt = group.createdAt.toISOString();
    return groupDto;
  }

  async getGroupsOfUser(userId: string): Promise<GroupDto[]> {
    const groupMembers = await this.groupMemberModel.find({ user: userId });
    const groups = await Promise.all(
      groupMembers.map((e) => this.getGroup(e.group as string)),
    );
    return groups.filter((e): e is GroupDto => e !== null);
  }

  async getRoleOfMember(groupId: string, userId: string): Promise<Role | null> {
    const member = await this.groupMemberModel.findOne({
      group: groupId,
      user: userId,
    });
    return member?.role ?? null;
  }
}
