import { Request } from 'express';
import { UserDocument } from 'src/models/user.model';
export interface AuthRequest extends Request {
  user: UserDocument;
}
