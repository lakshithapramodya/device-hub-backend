import {Injectable} from '@nestjs/common';
import {PrismaService} from '@shared/services/prisma.service';

@Injectable()
export class DeviceRepository {
  constructor(private readonly prismaService: PrismaService) {}
}
