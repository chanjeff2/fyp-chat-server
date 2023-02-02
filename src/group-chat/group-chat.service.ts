import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  GroupMember,
  GroupMemberDocument,
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
  ) {}

  async createGroup(createGroupDto: CreateGroupDto): Promise<Group> {
    return await this.groupModel.create(createGroupDto);
  }

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
    return groupDto;
  }
}
