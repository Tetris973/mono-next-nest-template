import { Expose } from 'class-transformer';
export class JwtDto {
  @Expose()
  access_token: string;
}
