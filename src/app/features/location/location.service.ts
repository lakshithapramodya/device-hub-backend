import {Injectable, NotFoundException} from '@nestjs/common';
import {LocationRepository} from '@features/location/repository/location.repository';
import {CreateLocationDto} from '@features/location/dto/create-location.dto';
import {Location} from '@features/location/entity/location.entity';
import {UpdateLocationDto} from '@features/location/dto/update-location.dto';

@Injectable()
export class LocationService {
  constructor(private readonly locationRepository: LocationRepository) {}

  async create(dto: CreateLocationDto): Promise<Location> {
    return await this.locationRepository.createLocation(dto);
  }

  async getLocations(
    page: number,
    limit: number,
  ): Promise<{
    data: Location[];
    total: number;
  }> {
    return await this.locationRepository.getLocationList(page, limit);
  }

  async getLocationsWithoutPagination(): Promise<Location[]> {
    return await this.locationRepository.getAllLocationsWithoutPagination();
  }

  async getById(locationId: string): Promise<Location> {
    return this.findLocationById(locationId);
  }

  async updateLocation(dto: UpdateLocationDto, locationId: string): Promise<Location> {
    const location = await this.findLocationById(locationId);

    return await this.locationRepository.updateLocationById(location.id, dto);
  }

  async delete(locationId: string) {
    const location = await this.findLocationById(locationId);

    await this.locationRepository.deleteLocationById(location.id);

    return `You have successfully removed the location.`;
  }

  async countLocations(): Promise<number> {
    return await this.locationRepository.count();
  }

  async countLocationsByMonth(month: number): Promise<number> {
    return await this.locationRepository.countLocationsByMonth(month);
  }

  private async findLocationById(locationId: string): Promise<Location> {
    const location = await this.locationRepository.getLocationById(locationId);

    if (!location) {
      throw new NotFoundException(`Location with ID ${locationId} not found`);
    }

    return location;
  }
}
