import {Module} from '@nestjs/common';
import {DashboardController} from './dashboard.controller';
import {DashboardService} from './dashboard.service';
import {DeviceModule} from '@features/device/device.module';
import {LocationModule} from '@features/location/location.module';

@Module({
  imports: [DeviceModule, LocationModule],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
