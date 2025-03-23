import {DeviceRepository} from '@features/device/repository/device.repository';
import {LocationService} from '@features/location/location.service';
import {Injectable} from '@nestjs/common';

@Injectable()
export class DashboardService {
  constructor(
    private readonly deviceRepository: DeviceRepository,
    private readonly locationService: LocationService,
  ) {}

  async getMetricsSummary(): Promise<{
    totalLocations: number;
    totalDevices: number;
    devicePerLocation: number;
    inactiveDevices: number;
    chartData: {
      devices: number;
      locations: number;
    }[];
  }> {
    const totalLocations = await this.locationService.countLocations();
    const totalDevices = await this.deviceRepository.countDevices();
    const inactiveDevices = await this.deviceRepository.countInactiveDevices();
    const devicePerLocation = totalDevices / totalLocations;

    // Return devices and locations from jan to dec.
    const chartData = await Promise.all(
      Array.from({length: 12}, async (_, month) => ({
        devices: await this.deviceRepository.countDevicesByMonth(month),
        locations: await this.locationService.countLocationsByMonth(month),
      })),
    );

    return {
      totalLocations,
      totalDevices,
      devicePerLocation,
      inactiveDevices,
      chartData,
    };
  }
}
