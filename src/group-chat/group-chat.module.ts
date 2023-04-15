import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsModule } from 'src/events/events.module';
import { MediaModule } from 'src/media/media.module';
import { GroupMember, GroupMemberSchema } from 'src/models/group-member.model';
import { Group, GroupSchema } from 'src/models/group.model';
import { UsersModule } from 'src/users/users.module';
import { GroupChatController } from './group-chat.controller';
import { GroupChatService } from './group-chat.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Group.name, schema: GroupSchema },
      { name: GroupMember.name, schema: GroupMemberSchema },
    ]),
    UsersModule,
    EventsModule,
    MediaModule,
  ],
  controllers: [GroupChatController],
  providers: [GroupChatService],
  exports: [GroupChatService],
})
export class GroupChatModule {}
