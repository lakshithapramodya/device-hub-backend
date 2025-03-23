import {RefreshToken as DbToken} from '@prisma/client';

export class RefreshToken implements DbToken {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  used: boolean;
  tokenHash: string;
  expiresAt: Date;
  issuedAt: Date;
}
