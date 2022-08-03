import { Resolver, Query, Args } from '@nestjs/graphql';
import { WeatherQueryDto } from './dto/weather-query.dto';
import { WeatherDescription } from './models/weather-description.model';
import { WeatherService } from './weather.service';

@Resolver((of) => WeatherDescription)
export class WeatherResolver {
  constructor(private readonly weatherService: WeatherService) {}

  @Query((returns) => WeatherDescription)
  async getWeatherDescription(
    @Args('weatherQueryParams') query: WeatherQueryDto,
  ): Promise<WeatherDescription> {
    return await this.weatherService.getWeatherDescription(query);
  }
}
