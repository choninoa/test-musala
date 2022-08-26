import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { GatewayService } from './gateway.service';
import { Device } from './schemas/device.schema';
import { Gateway } from './schemas/gateway.schema';

describe('GatewayService', () => {
  let service: GatewayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
     // imports:[],
      providers: [GatewayService,
        {
          provide: getModelToken(Gateway.name),
          useValue: 'gatewayModel',
        }],
    }).compile();

    service = module.get<GatewayService>(GatewayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
