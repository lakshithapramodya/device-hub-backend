import {Injectable} from '@nestjs/common';
import {PrismaService} from '@shared/services/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserByEmail(email: string) {
    return await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  async getUserById(id: string) {
    return await this.prismaService.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  async getUserWithToken(id: string) {
    return this.prismaService.user.findUnique({
      where: {id},
      include: {
        refreshTokens: {
          select: {
            tokenHash: true,
          },
        },
      },
    });
  }

  async createUser(dto: any) {
    return await this.prismaService.user.create({
      data: dto,
    });
  }

  async updateRefreshToken(userId: string, newTokenHash: string): Promise<void> {
    const tokenExpiration = new Date();
    tokenExpiration.setDate(tokenExpiration.getDate() + 7);

    const existingToken = await this.prismaService.refreshToken.findFirst({
      where: {userId: userId},
    });
    if (existingToken) {
      await this.prismaService.refreshToken.update({
        where: {id: existingToken.id},
        data: {
          tokenHash: newTokenHash,
          expiresAt: tokenExpiration,
          issuedAt: new Date(),
        },
      });
    } else {
      await this.prismaService.refreshToken.create({
        data: {
          userId: userId,
          tokenHash: newTokenHash,
          expiresAt: tokenExpiration,
          issuedAt: new Date(),
        },
      });
    }
  }

  async removeRefreshToken(userId: string) {
    await this.prismaService.refreshToken.deleteMany({
      where: {
        userId: userId,
      },
    });
  }
}
