import { Field, InputType } from '@nestjs/graphql';
import { IsISO8601, IsLatitude, IsLongitude } from 'class-validator';

@InputType()
export class WeatherQueryDto {
  @IsLatitude()
  @Field()
  readonly lat: string;

  @IsLongitude()
  @Field()
  readonly lon: string;

  @IsISO8601()
  @Field()
  readonly date: string;
}
