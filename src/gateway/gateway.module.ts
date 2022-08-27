import { Module } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { GatewayController } from './gateway.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Device, DeviceSchema } from './schemas/device.schema';
import { Gateway, GatewaySchema } from './schemas/gateway.schema';
import { DeviceService } from './device.service';
import { DeviceController } from './device.controller';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Device.name, schema: DeviceSchema },
    { name: Gateway.name, schema: GatewaySchema }
  
  ])],
  providers: [GatewayService,DeviceService],
  controllers: [GatewayController,DeviceController]
})
export class GatewayModule {}
