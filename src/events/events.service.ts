import { Injectable } from '@nestjs/common';
import { DevicesService } from 'src/devices/devices.service';
import { MessageDto } from './dto/message.dto';
import { SendMessageDto } from './dto/send-message.dto';
import admin from 'firebase-admin';
import { Message } from 'firebase-admin/lib/messaging/messaging-api';

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
    dto.sentAt = sendMessageDto.sentAt.toISOString();

    // get recipient fcm token
    const device = await this.devicesService.getDevice(
      sendMessageDto.recipientUserId,
      sendMessageDto.recipientDeviceId,
    );

    if (device === null) {
      return null;
    }

    const message: Message = {
      token: device.firebaseMessagingToken,
      data: {
        ...dto,
      },
      // Set Android priority to "high"
      android: {
        priority: 'high',
      },
      // Add APNS (Apple) config
      apns: {
        payload: {
          aps: {
            contentAvailable: true,
          },
        },
        headers: {
          'apns-push-type': 'background',
          'apns-priority': '5', // Must be `5` when `contentAvailable` is set to true.
          'apns-topic': 'io.flutter.plugins.firebase.messaging', // bundle identifier
        },
      },
    };

    const messageId = await admin.messaging().send(message);

    return messageId;
  }
}
