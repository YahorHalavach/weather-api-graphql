import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { day1Description, mockQuery } from './mocks/mocks';
import { WeatherResolver } from './weather.resolver';
import { WeatherService } from './weather.service';

describe('WeatherResolver', () => {
  let weatherResolver: WeatherResolver;

  const mockWeatherService = {
    getWeatherDescription: jest.fn().mockImplementation(() => day1Description),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WeatherResolver, WeatherService],
      imports: [HttpModule],
    })
      .overrideProvider(WeatherService)
      .useValue(mockWeatherService)
      .compile();

    weatherResolver = module.get<WeatherResolver>(WeatherResolver);
  });

  it('Should be defined', () => {
    expect(weatherResolver).toBeDefined();
  });

  it('Should return weather description', async () => {
    expect(await weatherResolver.weatherDescription(mockQuery)).toEqual(
      day1Description,
    );
  });

  it('Should be called with provided arguments', () => {
    expect(mockWeatherService.getWeatherDescription).toHaveBeenCalledWith(
      mockQuery,
    );
  });

  //-------------------------------------------------------------
  // Due to validation pipe negative cases have been moved to E2E
});
