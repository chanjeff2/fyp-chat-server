import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupMember, GroupMemberSchema } from 'src/models/group-member.model';
import { Group, GroupSchema } from 'src/models/group.model';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { GroupChatController } from './group-chat.controller';
import { GroupChatService } from './group-chat.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Group.name, schema: GroupSchema },
      { name: GroupMember.name, schema: GroupMemberSchema },
    ]),
    UsersModule,
  ],
  controllers: [GroupChatController],
  providers: [GroupChatService],
})
export class GroupChatModule {}
