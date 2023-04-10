import { Injectable } from '@nestjs/common';
import { DevicesService } from 'src/devices/devices.service';
import { MessageDto } from './dto/message.dto';
import { SendMessageDto } from './dto/send-message.dto';
import admin from 'firebase-admin';
import { Message } from 'firebase-admin/lib/messaging/messaging-api';
import { SendMessageResponse } from './dto/send-message.response.dto';
import { AccessControlDto } from '../group-chat/dto/access-control.dto';
import { SendAccessControlDto } from 'src/group-chat/dto/send-access-control.dto';
import { FCMEventType } from 'src/enums/fcm-event-type.enum';

@Injectable()
export class EventsService {
  constructor(private devicesService: DevicesService) {}

  private createFcmMessage(
    token: string,
    data: { [key: string]: string },
  ): Message {
    return {
      token: token,
      data: {
        ...data,
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
  }

  async sendMessage(
    senderUserId: string,
    sendMessageDto: SendMessageDto,
  ): Promise<SendMessageResponse> {
    const response = new SendMessageResponse();

    const targetedDeviceIds = sendMessageDto.messages.map(
      (e) => e.recipientDeviceId,
    );
    const deviceIdToMessageMap = new Map(
      sendMessageDto.messages.map((e) => [e.recipientDeviceId, e]),
    );
    const devicesToSend = new Set(targetedDeviceIds);

    // check missing deviceIds
    const recipientDevices = await this.devicesService.getAllDevices(
      sendMessageDto.recipientUserId,
    );
    const recipientDeviceIds = recipientDevices.map((e) => e.deviceId);
    response.missingDeviceIds = recipientDeviceIds.filter(
      // not targeted
      (e) => !deviceIdToMessageMap.has(e),
    );
    // check removed devices
    const recipientDeviceIdSet = new Set(recipientDeviceIds);
    response.removedDeviceIds = targetedDeviceIds.filter((e) => {
      if (!recipientDeviceIdSet.has(e)) {
        // not in recipient device list
        devicesToSend.delete(e);
        return true;
      } else {
        return false;
      }
    });
    // check mis match (deviceId, registrationId)
    response.misMatchDeviceIds = recipientDevices
      .filter(
        // only check for targeted devices
        (e) => deviceIdToMessageMap.has(e.deviceId),
      )
      .filter(
        // check for registrationId mis match
        (e) => {
          if (
            e.registrationId !==
            deviceIdToMessageMap.get(e.deviceId)?.recipientRegistrationId
          ) {
            devicesToSend.delete(e.deviceId);
            return true;
          } else {
            return false;
          }
        },
      )
      .map((e) => e.deviceId);

    const recipientDeviceMap = new Map(
      recipientDevices.map((e) => [e.deviceId, e]),
    );

    await Promise.all(
      Array.from(devicesToSend).map(async (id) => {
        const message = deviceIdToMessageMap.get(id);
        if (!message) {
          return; // how?
        }
        const dto = new MessageDto();
        dto.type = FCMEventType.TextMessage;
        dto.senderUserId = senderUserId;
        dto.senderDeviceId = sendMessageDto.senderDeviceId.toString();
        dto.chatroomId = sendMessageDto.chatroomId;
        dto.cipherTextType = message.cipherTextType.toString();
        dto.content = message.content;
        dto.sentAt = sendMessageDto.sentAt;

        // get recipient fcm token
        const device = recipientDeviceMap.get(id);
        if (device == null) {
          return; // again how?
        }

        const fcmMessage: Message = this.createFcmMessage(
          device.firebaseMessagingToken,
          { ...dto },
        );

        try {
          const messageId = await admin.messaging().send(fcmMessage);
          return messageId;
        } catch (e) {
          console.error(e);
          if (
            e.code === 'messaging/registration-token-not-registered' ||
            e.code === 'messaging/invalid-argument'
          ) {
            // remove stale device
            this.devicesService.deleteDevice(
              sendMessageDto.recipientUserId,
              device.deviceId,
            );
            response.removedDeviceIds.push(device.deviceId);
          }
          return;
        }
      }),
    );

    return response;
  }

  async sendAccessControlEvent(
    senderUserId: string,
    recipientUserId: string,
    chatroomId: string,
    event: SendAccessControlDto,
  ): Promise<void> {
    const dto = new AccessControlDto();
    dto.type = event.type;
    dto.senderUserId = senderUserId;
    dto.targetUserId = event.targetUserId;
    dto.chatroomId = chatroomId;
    dto.sentAt = event.sentAt;

    const recipientDevices = await this.devicesService.getAllDevices(
      recipientUserId,
    );
    await Promise.all(
      recipientDevices.map(async (device) => {
        const fcmMessage: Message = this.createFcmMessage(
          device.firebaseMessagingToken,
          { ...dto },
        );
        try {
          const messageId = await admin.messaging().send(fcmMessage);
          return messageId;
        } catch (e) {
          console.error(e);
          if (
            e.code === 'messaging/registration-token-not-registered' ||
            e.code === 'messaging/invalid-argument'
          ) {
            // remove stale device
            this.devicesService.deleteDevice(recipientUserId, device.deviceId);
          }
        }
      }),
    );
  }

  /// broardcast the invitation, assuming the new member is already added to group
  async sendInvitation(
    senderUserId: string,
    recipientUserId: string,
    chatroomId: string,
    sentAt: string,
  ): Promise<void> {
    const dto = new AccessControlDto();
    dto.type = FCMEventType.AddMember;
    dto.senderUserId = senderUserId;
    dto.targetUserId = recipientUserId;
    dto.chatroomId = chatroomId;
    dto.sentAt = sentAt;

    const recipientDevices = await this.devicesService.getAllDevices(
      recipientUserId,
    );
    await Promise.all(
      recipientDevices.map(async (device) => {
        const fcmMessage: Message = this.createFcmMessage(
          device.firebaseMessagingToken,
          { ...dto },
        );
        try {
          const messageId = await admin.messaging().send(fcmMessage);
          return messageId;
        } catch (e) {
          console.error(e);
          if (
            e.code === 'messaging/registration-token-not-registered' ||
            e.code === 'messaging/invalid-argument'
          ) {
            // remove stale device
            this.devicesService.deleteDevice(recipientUserId, device.deviceId);
          }
        }
      }),
    );
  }
}
