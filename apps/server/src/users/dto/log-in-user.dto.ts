import { MinLength, MaxLength, IsStrongPassword } from 'class-validator';

export class LogInUserDto {
  @MinLength(6)
  @MaxLength(32)
  username: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password: string;
}
