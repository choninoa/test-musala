import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Inject, NotFoundException, Param, Patch, Post, Query, Res } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ValidateMongoIdPipe } from '../generic/pipes/mongoid.pipe';
import { IntervalDto } from '../generic/interval.dto';
import { CreateGatewayDto } from './dtos/create-gateway.dto';
import { ExistElementDto } from './dtos/exists.gateway.dto';
import { GatewayService } from './gateway.service';
import { Gateway } from './schemas/gateway.schema';
import { UpdateGatewayDto } from './dtos/update.gateway.dto';
import { FindResultDto } from './dtos/find.result.dto';
@ApiTags("Gateways")
@Controller('gateway')
export class GatewayController {
    constructor(
        @Inject(GatewayService)
        private readonly gateWayService: GatewayService

    ) { }

    @ApiOkResponse({
        type:  FindResultDto
    })
    @ApiOperation({ summary: 'Return all/paginate gateways' })
    @Get('listAll')
    async listAllGateways(@Res() res, @Query() query: IntervalDto):Promise<FindResultDto>{
        const result = await this.gateWayService.getAll(query,null,{serialNumber:'desc'},{
            path:'devices',
            keys:'_id  uid status'
        });
        return res.status(HttpStatus.OK).json(result);
    }

    @ApiCreatedResponse({
        type: Gateway
    })
    @ApiBadRequestResponse({
        type: ExistElementDto
    })
    @ApiOperation({ summary: 'Create a Gateway' })
    @Post('create')
    async createGateWay(@Res() res, @Body() dto: CreateGatewayDto): Promise<Gateway> {
        const exist = await this.gateWayService.getOne({
            $or: [{ ipv4: dto.ipv4 }, { serialNumber: dto.serialNumber }]
        },
        )
        //console.log(exist)
        if (exist)
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: 'Gateway already exists on bd',
                element: exist
            });

        const result = await this.gateWayService.create(dto);
        return res.status(HttpStatus.CREATED).json(result);
    }

    @ApiOkResponse({type:Gateway,description:'Return deleted gateway'})
    @ApiOperation({summary:'Remove gateway'})
    @Delete('delete/:id')
    async deleteGateway(@Res() res, @Param('id',ValidateMongoIdPipe) id: string) {
        const deleted=await this.gateWayService.delete(id);
        return res.status(HttpStatus.OK).json(deleted)
    }

    @ApiOkResponse({type:Gateway,description:'Return updated gateway'})
    @ApiOperation({summary:'Update a gateway'})
    @Patch('update/:id')
    async update(@Res() res, @Param('id',ValidateMongoIdPipe) id: string,@Body() dto: UpdateGatewayDto) {
        const updated=await this.gateWayService.update(id,dto);
        return res.status(HttpStatus.OK).json(updated)
    }

    @ApiOkResponse({type:Gateway,description:'Return data  from a found gateway'})
    @ApiNotFoundResponse({description:'Gateway not found!!'})
    @ApiOperation({summary:'Fetch gateway data'})
    @Get('fetch/:id')
    async getOne(@Res() res, @Param('id',ValidateMongoIdPipe) id: string) {
        const found=await this.gateWayService.get(id,{
            path:'devices',
            keys:'_id  uid vendor status createdAt'
        });
        if(!found)
        throw new NotFoundException(`Gateway ${id} not found!!`)
        return res.status(HttpStatus.OK).json(found)
    }

}
