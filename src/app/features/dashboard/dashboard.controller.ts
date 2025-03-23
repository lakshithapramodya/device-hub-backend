import {Controller, Get, HttpCode, HttpStatus} from '@nestjs/common';
import {DashboardService} from './dashboard.service';
import {ApiBearerAuth, ApiOperation, ApiTags} from '@nestjs/swagger';
import {ApiResources} from '@core/constants/resource-constants';

@ApiBearerAuth()
@Controller(ApiResources.DASHBOARD)
@ApiTags(ApiResources.DASHBOARD)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary: 'Get dashboard metrics'})
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
    return this.dashboardService.getMetricsSummary();
  }
}
