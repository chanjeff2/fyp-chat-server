import { Injectable } from '@nestjs/common';
import { DevicesService } from 'src/devices/devices.service';
import { MessageDto } from './dto/message.dto';
import { SendMessageDto } from './dto/send-message.dto';
import admin from 'firebase-admin';

@Injectable()
export class EventsService {
  constructor(private devicesService: DevicesService) {}

  async sendMessage(
    userId: string,
    sendMessageDto: SendMessageDto,
  ): Promise<string | null> {
    const dto = new MessageDto();
    dto.senderUserId = userId;
    dto.senderDeviceId = sendMessageDto.senderDeviceId.toString();
    dto.content = sendMessageDto.content;

    // get recipient fcm token
    const device = await this.devicesService.getDevice(
      sendMessageDto.recipientUserId,
      sendMessageDto.recipientDeviceId,
    );

    if (device === null) {
      return null;
    }

    const message = {
      data: {
        ...dto,
      },
      token: device.firebaseMessagingToken,
    };

    const messageId = await admin.messaging().send(message);

    return messageId;
  }
}
