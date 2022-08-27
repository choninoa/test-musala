import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Inject, NotFoundException, Param, Patch, Post, Query, Res } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ValidateMongoIdPipe } from '../generic/pipes/mongoid.pipe';
import { IntervalDto } from '../generic/interval.dto';
import { CreateDeviceDto } from './dtos/create-device.dto';
import { Device } from './schemas/device.schema';
import { FindResultDto } from './dtos/find.result.dto';
import { DeviceService } from './device.service';
import { ExistElementDto } from './dtos/exists.gateway.dto';
@ApiTags("Devices")
@Controller('device')
export class DeviceController {
    constructor(
        @Inject(DeviceService)
        private readonly deviceService: DeviceService

    ) { }

    @ApiOkResponse({
        type:  FindResultDto
    })
    @ApiOperation({ summary: 'Return all/paginate devices' })
    @Get('listAll')
    async listAllDevices(@Res() res, @Query() query: IntervalDto):Promise<FindResultDto>{
        const result = await this.deviceService.getAll(query,null,{
            createdAt:'desc'
        },{
           path: 'gateway',
            keys:'_id serialNumber name'
        });
        return res.status(HttpStatus.OK).json(result);
    }

    @ApiCreatedResponse({
        type: Device
    })
    @ApiBadRequestResponse({
        type: ExistElementDto
    })
    @ApiOperation({ summary: 'Create a Device' })
    @Post('create')
    async createGateWay(@Res() res, @Body() dto: CreateDeviceDto): Promise<Device> {
        const exist = await this.deviceService.getOne({
            uid: dto.uid 
        },
        )
        //console.log(exist)
        if (exist)
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: 'Device already exists on bd',
                element: exist
            });

        const result = await this.deviceService.create(dto);
        return res.status(HttpStatus.CREATED).json(result);
    }

    @ApiOkResponse({type:Device,description:'Return deleted device'})
    @ApiOperation({summary:'Remove device'})
    @Delete('delete/:id')
    async deleteDevice(@Res() res, @Param('id',ValidateMongoIdPipe) id: string) {
        const deleted=await this.deviceService.delete(id);
        return res.status(HttpStatus.OK).json(deleted)
    }

    /*@ApiOkResponse({type:Device,description:'Return updated device'})
    @ApiOperation({summary:'Update a device'})
    @Patch('update/:id')
    async update(@Res() res, @Param('id',ValidateMongoIdPipe) id: string,@Body() dto: CreateDeviceDto) {
        const updated=await this.deviceService.update(id,dto);
        return res.status(HttpStatus.OK).json(updated)
    }*/

    @ApiOkResponse({type:Device,description:'Return data  from a found device'})
    @ApiNotFoundResponse({description:'Device not found!!'})
    @ApiOperation({summary:'Fetch device data'})
    @Get('fetch/:id')
    async getOne(@Res() res, @Param('id',ValidateMongoIdPipe) id: string) {
        const found=await this.deviceService.get(id,{
            path: 'gateway',
             keys:'_id serialNumber name ipv4 '
         });
        if(!found)
        throw new NotFoundException(`Device ${id} not found!!`)
        return res.status(HttpStatus.OK).json(found)
    }

}
