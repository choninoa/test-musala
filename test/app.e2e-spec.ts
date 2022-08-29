import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Gateway } from 'src/gateway/schemas/gateway.schema';
import mongoose from 'mongoose';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  beforeAll(done => {
    done()
  });
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true
      }),
    );
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
  describe('/gateway/create (POST) crete gateway ', () => {
    it('Validate ipv4 creating gateway', async () => {
      const mockGateway: Gateway = {
        serialNumber: 'sn-234133',
        name: 'Test Creating',
        ipv4: '192.168.1.300'
      }
     return await request(app.getHttpServer())
        .post('/gateway/create')
        .send(mockGateway)
        .expect(HttpStatus.BAD_REQUEST)
    })

  });

  afterAll(async () => {
    // Closing the DB connection allows Jest to exit successfully.
    mongoose.connection.close()

    return await app.close()

  })
});
