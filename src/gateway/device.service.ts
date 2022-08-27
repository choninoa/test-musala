import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, SortOrder } from 'mongoose';
import { IntervalDto } from 'src/generic/interval.dto';
import { CService } from '../generic/crud.service';
import { CreateDeviceDto } from './dtos/create-device.dto';
import { FindResultDto } from './dtos/find.result.dto';
import { GatewayService } from './gateway.service';
import { Device } from './schemas/device.schema';
import { Gateway } from './schemas/gateway.schema';

@Injectable()
export class DeviceService extends CService<Device> {
    constructor(
        @InjectModel(Device.name) private deviceModel: Model<Device & Document>,
        @Inject(GatewayService)
        private readonly gatewayService: GatewayService

    ) {
        super(deviceModel);
    }

    async create(dto: CreateDeviceDto): Promise<Device> {
        const gateway = await this.gatewayService.getOne({
            _id: dto.gatewayId
        }, {
            path: 'devices',
            keys: '_id'
        });
        if (!gateway)
            throw new NotFoundException(`Gateway ${dto.gatewayId} not found`);

        if (gateway.devices?.length == 10)
            throw new NotFoundException(`Gateway ${dto.gatewayId} already has 10 devices, only 10 devices allowed`);


        const device: Device = {
            uid: dto.uid,
            vendor: dto.vendor,
            status: dto.status,
            gateway: {
                _id: dto.gatewayId
            } as Gateway
        }

        const res = await super.create(device);
        gateway.devices.push(res)
        await gateway.save()
        return res
    }

    async delete(id: string): Promise<any> {
        const device = await super.get(id, {
            path: 'gateway',
            keys: '_id'
        })
        if (!device)
            throw new NotFoundException(`Device ${id} not found`)
       
            const gateway = await this.gatewayService.get(device.gateway._id, {
            path: 'devices',
            keys: '_id  uid status'
        })

        const deleted = await super.delete(id);


        gateway.devices = gateway.devices.filter(d => d._id != id)
    
        await gateway.save()
        return deleted
    }
}
