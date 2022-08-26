import { BadRequestException, Body, Controller, Get, HttpStatus, Inject, Post, Query, Res } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { type } from 'os';
import { IntervalDto } from 'src/generic/interval.dto';
import { CreateGatewayDto } from './dtos/create-gateway.dto';
import { ExistElementDto } from './dtos/exists.gateway.dto';
import { GatewayService } from './gateway.service';
import { Gateway } from './schemas/gateway.schema';
@ApiTags("Gateways")
@Controller('gateway')
export class GatewayController {
    constructor(
        @Inject(GatewayService)
        private readonly gateWayService: GatewayService

    ) { }

    @ApiOkResponse({
        type: [Gateway]
    })
    @ApiOperation({ summary: 'Return all/paginate gateways' })
    @Get('listAllGateways')
    async listAllGateways(@Res() res, @Query() query: IntervalDto): Promise<Gateway[]> {
        const result = await this.gateWayService.getAll(query);
        return res.status(HttpStatus.OK).json(result);
    }

    @ApiCreatedResponse({
        type: Gateway
    })
    @ApiBadRequestResponse({
        type: ExistElementDto
    })
    @ApiOperation({ summary: 'Create a Gateway' })
    @Post('createGateWay')
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
}
