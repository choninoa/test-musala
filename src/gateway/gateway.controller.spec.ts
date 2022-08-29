import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { DeviceService } from './device.service';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { Gateway } from './schemas/gateway.schema';

describe('GatewayController', () => {
  let controller: GatewayController;
 
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GatewayController],
      providers:[GatewayService,
         {
          provide: getModelToken(Gateway.name),
          useValue: 'gatewayModel',
        }]
    }).compile();

    controller = module.get<GatewayController>(GatewayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

 

});
