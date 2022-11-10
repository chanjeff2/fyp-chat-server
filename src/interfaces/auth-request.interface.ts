import { Request } from 'express';
import { User } from 'src/models/user.model';
export interface AuthRequest extends Request {
  user: User;
}
