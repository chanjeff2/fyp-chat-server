import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/models/group-member.model';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
