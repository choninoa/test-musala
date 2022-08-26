import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CService } from 'src/generic/crud.service';
import { Device } from './schemas/device.schema';
import { Gateway } from './schemas/gateway.schema';

@Injectable()
export class DeviceService extends CService<Device> {
    constructor(
        @InjectModel(Gateway.name) private deviceModel: Model<Device & Document>
    ) {
        super(deviceModel);
    }
}
