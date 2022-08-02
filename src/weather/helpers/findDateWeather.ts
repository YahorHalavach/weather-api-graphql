import { WeatherDescription } from '../models/weather-description.model';
import { Weather } from '../models/weather.model';

export default (weatherMap: Weather[], now: number) => {
  let n = -1;

  while (++n < weatherMap.length && weatherMap[n].dt < now);

  return new WeatherDescription(weatherMap[n].description);
};
