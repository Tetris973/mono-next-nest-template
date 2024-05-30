import { Expose } from 'class-transformer';
export class JwtDto {
  @Expose()
  accessToken: string;
}
