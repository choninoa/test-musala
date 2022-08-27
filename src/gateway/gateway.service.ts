import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, SortOrder } from 'mongoose';
import { IntervalDto } from 'src/generic/interval.dto';
import { CService } from '../generic/crud.service';
import { FindResultDto } from './dtos/find.result.dto';
import { Gateway } from './schemas/gateway.schema';

@Injectable()
export class GatewayService extends CService<Gateway> {
    constructor(
        @InjectModel(Gateway.name) private gatewayModel: Model<Gateway & Document>
    ) {
        super(gatewayModel);
    }
   
}
