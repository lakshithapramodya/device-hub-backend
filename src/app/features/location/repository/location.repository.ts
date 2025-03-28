import {PrismaService} from '@shared/services/prisma.service';
import {CreateLocationDto} from '@features/location/dto/create-location.dto';
import {Injectable} from '@nestjs/common';
import {LocationStatus} from '@prisma/client';
import {UpdateLocationDto} from '@features/location/dto/update-location.dto';

@Injectable()
export class LocationRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createLocation(dto: CreateLocationDto) {
    const createdLocation = await this.prismaService.location.create({
      data: {
        title: dto.title,
        address: dto.address,
        status: dto.status,
      },
    });

    return {
      ...createdLocation,
      status: createdLocation.status as LocationStatus,
    };
  }

  async getLocationList(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const total = await this.prismaService.location.count();

    const locations = await this.prismaService.location.findMany({
      skip,
      take: limit,
      include: {
        Device: true,
        _count: {
          select: {
            Device: true,
          },
        },
      },
    });

    return {
      data: locations.map(location => ({
        ...location,
        devices: location._count.Device,
        _count: undefined,
      })),
      total,
    };
  }

  async getAllLocationsWithoutPagination() {
    return await this.prismaService.location.findMany();
  }

  async getLocationById(id: string) {
    return await this.prismaService.location.findUnique({
      where: {
        id: id,
      },
    });
  }

  async updateLocationById(id: string, dto: UpdateLocationDto) {
    return await this.prismaService.location.update({
      where: {
        id: id,
      },
      data: dto,
    });
  }

  async deleteLocationById(id: string) {
    await this.prismaService.location.delete({
      where: {
        id: id,
      },
    });
  }

  async count(): Promise<number> {
    return await this.prismaService.location.count();
  }

  async countLocationsByMonth(month: number): Promise<number> {
    const year = new Date().getFullYear();
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    return await this.prismaService.location.count({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }
}
