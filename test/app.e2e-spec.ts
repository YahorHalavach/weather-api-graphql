import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import {
  afterDay7ISO,
  beforeDay1ISO,
  day1ISO,
  day1ResponseBody,
  day2ISO,
  day2ResponseBody,
  day6ISO,
  day6ResponseBody,
  day7ISO,
  day7ResponseBody,
  gqlQuery,
  InvalidDate,
  InvalidLatitude,
  InvalidLongitude,
  lat,
  lon,
  mockResponse,
  Next7DaysExceptionMsg,
} from '../src/weather/mocks/mocks';
import { of } from 'rxjs';
import { AppModule } from '../src/app.module';

describe('AppModule (e2e)', () => {
  let app: INestApplication;
  let httpService: HttpService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        ConfigModule.forRoot({
          envFilePath: '.development.env',
        }),
      ],
    }).compile();

    httpService = moduleFixture.get<HttpService>(HttpService);
    jest.spyOn(httpService, 'get').mockImplementation(() => of(mockResponse));

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  const gqlPath = '/graphql';

  // Positive cases

  it('Query weatherDescription: 200 on Day 1', async () => {
    const { body } = await request(app.getHttpServer())
      .post(gqlPath)
      .send({ query: gqlQuery(lat, lon, day1ISO) });

    expect(body).toEqual(day1ResponseBody);
  });

  it('Query weatherDescription: 200 on Day 2', async () => {
    const { body } = await request(app.getHttpServer())
      .post(gqlPath)
      .send({ query: gqlQuery(lat, lon, day2ISO) });

    expect(body).toEqual(day2ResponseBody);
  });

  it('Query weatherDescription: 200 on Day 6', async () => {
    const { body } = await request(app.getHttpServer())
      .post(gqlPath)
      .send({ query: gqlQuery(lat, lon, day6ISO) });

    expect(body).toEqual(day6ResponseBody);
  });

  it('Query weatherDescription: 200 on Day 6', async () => {
    const { body } = await request(app.getHttpServer())
      .post(gqlPath)
      .send({ query: gqlQuery(lat, lon, day6ISO) });

    expect(body).toEqual(day6ResponseBody);
  });

  it('Query weatherDescription: 200 on Day 7', async () => {
    const { body } = await request(app.getHttpServer())
      .post(gqlPath)
      .send({ query: gqlQuery(lat, lon, day7ISO) });

    expect(body).toEqual(day7ResponseBody);
  });

  // Negative cases

  it('Query weatherDescription: 400 on Before Day 1', async () => {
    const { body } = await request(app.getHttpServer())
      .post(gqlPath)
      .send({ query: gqlQuery(lat, lon, beforeDay1ISO) });

    expect(body.data).toEqual(null);
    expect(body.errors[0].message).toEqual(Next7DaysExceptionMsg);
    expect(body.errors[0].extensions.exception.status).toEqual(400);
  });

  it('Query weatherDescription: 400 on After Day 7', async () => {
    const { body } = await request(app.getHttpServer())
      .post(gqlPath)
      .send({ query: gqlQuery(lat, lon, afterDay7ISO) });

    expect(body.data).toEqual(null);
    expect(body.errors[0].message).toEqual(Next7DaysExceptionMsg);
    expect(body.errors[0].extensions.exception.status).toEqual(400);
  });

  it('Query weatherDescription: 400 on invalid latitude', async () => {
    const { body } = await request(app.getHttpServer())
      .post(gqlPath)
      .send({ query: gqlQuery(null, lon, day1ISO) });

    expect(body.data).toEqual(null);
    expect(body.errors[0].extensions.response).toEqual(InvalidLatitude);
  });

  it('Query weatherDescription: 400 on invalid longitude', async () => {
    const { body } = await request(app.getHttpServer())
      .post(gqlPath)
      .send({ query: gqlQuery(lat, null, day1ISO) });

    expect(body.data).toEqual(null);
    expect(body.errors[0].extensions.response).toEqual(InvalidLongitude);
  });

  it('Query weatherDescription: 400 on invalid date format', async () => {
    const { body } = await request(app.getHttpServer())
      .post(gqlPath)
      .send({ query: gqlQuery(lat, lon, '2022-2323-1233') });

    expect(body.data).toEqual(null);
    expect(body.errors[0].extensions.response).toEqual(InvalidDate);
  });

  it('Query weatherDescription: 400 on date timestamp', async () => {
    const { body } = await request(app.getHttpServer())
      .post(gqlPath)
      .send({ query: gqlQuery(lat, lon, '1658302813000') });

    expect(body.data).toEqual(null);
    expect(body.errors[0].extensions.response).toEqual(InvalidDate);
  });
});
