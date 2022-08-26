import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CService } from '../generic/crud.service';
import { Gateway } from './schemas/gateway.schema';

@Injectable()
export class GatewayService extends CService<Gateway> {
    constructor(
        @InjectModel(Gateway.name) private gatewayModel: Model<Gateway & Document>
    ) {
        super(gatewayModel);
    }
}
