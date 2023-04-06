import { Message } from './message';

export class TextMessageDto extends Message {
  override type: string = 'text-message';
}
