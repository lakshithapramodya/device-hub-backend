import {Injectable} from '@nestjs/common';
import {PrismaService} from '@shared/services/prisma.service';
import {CreateDeviceDto} from '@features/device/dto/create-device.dto';
import {UpdateDeviceDto} from '@features/device/dto/update-device.dto';

@Injectable()
export class DeviceRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createDevice(dto: CreateDeviceDto) {
    return await this.prismaService.device.create({
      data: {
        name: dto.name,
        serialNumber: dto.serialNumber,
        description: dto.description,
        imageUrl: dto.imageUrl,
        locationId: dto.locationId,
        type: dto.type,
        status: dto.status,
      },
    });
  }

  async getDeviceById(id: string) {
    return await this.prismaService.device.findUnique({
      where: {
        id: id,
      },
    });
  }

  async getDeviceBySerialNumber(serialNumber: string) {
    return await this.prismaService.device.findUnique({
      where: {
        serialNumber: serialNumber,
      },
    });
  }

  async getDeviceList(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const total = await this.prismaService.device.count();

    const data = await this.prismaService.device.findMany({
      skip,
      take: limit,
      include: {
        location: {
          select: {
            id: true,
            title: true,
            address: true,
          },
        },
      },
    });

    return {
      data,
      total,
    };
  }

  async getDeviceListByLocation(locationId: string) {
    return await this.prismaService.device.findMany({
      where: {
        locationId: locationId,
      },
    });
  }

  async countDevicesByLocation(locationId: string): Promise<number> {
    return await this.prismaService.device.count({
      where: {locationId},
    });
  }

  async updateDevice(id: string, dto: UpdateDeviceDto) {
    return await this.prismaService.device.update({
      where: {
        id: id,
      },
      data: dto,
    });
  }

  async deleteDevice(id: string) {
    await this.prismaService.device.delete({
      where: {
        id: id,
      },
    });
  }

  async countDevices(): Promise<number> {
    return await this.prismaService.device.count();
  }

  async countInactiveDevices(): Promise<number> {
    return await this.prismaService.device.count({
      where: {
        status: 'Inactive',
      },
    });
  }

  async countDevicesByMonth(month: number): Promise<number> {
    const year = new Date().getFullYear();
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    return await this.prismaService.device.count({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }
}
