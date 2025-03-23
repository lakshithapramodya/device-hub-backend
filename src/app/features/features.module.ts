import {Module} from '@nestjs/common';
import {UserModule} from '@features/user/user.module';
import {LocationModule} from '@features/location/location.module';
import {DeviceModule} from './device/device.module';
import {DashboardModule} from './dashboard/dashboard.module';
@Module({
  imports: [UserModule, LocationModule, DeviceModule, DashboardModule],
})
export class FeaturesModule {}
