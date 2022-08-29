import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose from 'mongoose';
import { GatewayService } from './gateway.service';
import { Device, DeviceSchema } from './schemas/device.schema';
import { Gateway, GatewaySchema } from './schemas/gateway.schema';

describe('GatewayService', () => {
  let service: GatewayService;
  const mockGateway: Gateway = {
    serialNumber: 'test-sn-082022',
    name: 'Test GateWay',
    ipv4: '192.168.2.1'
  }
  beforeAll(done => {
    done()
  });
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost/musala'),
        MongooseModule.forFeature([
          { name: Device.name, schema: DeviceSchema },
          { name: Gateway.name, schema: GatewaySchema }

        ])
      ],
      providers: [GatewayService,
      /*{
          provide: getModelToken(Gateway.name),
          useValue: 'gatewayModel',
        }*/],
    }).compile();

    service = module.get<GatewayService>(GatewayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should delete if mockGateway exists', async () => {
    const exist = await service.getOne({ serialNumber: mockGateway.serialNumber });
    console.log('exist: ', exist)
    if (exist) {
      const deleted = await service.delete(exist._id);
      console.log('deleted: ', deleted)
      expect(deleted?.serialNumber).toBe(exist.serialNumber)

    }
    else console.log('No mockGateway found!!')
  });

  describe('create, update and remove gateway', () => {
    let created: Gateway, updated: Gateway, deleted: Gateway;

    it('create gateway', async () => {
      created = await service.create(mockGateway);
      expect(created).not.toBeNull();
    })

    it('update created gateway', async () => {
      updated = await service.update(created._id, {
        ipv4: '192.168.2.2'
      })
      expect(updated.ipv4).toEqual('192.168.2.2');
    })

    it('remove updated gateway', async () => {
      deleted = await service.delete(created._id);
      expect(deleted).toEqual(updated);
    })

  });
 
  afterAll(done => {
    // Closing the DB connection allows Jest to exit successfully.
    mongoose.connection.close()
    done()
  })
});
