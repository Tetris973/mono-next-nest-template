import { MinLength, MaxLength, IsStrongPassword } from 'class-validator';

export class LoginUserDto {
  @MinLength(6)
  @MaxLength(32)
  readonly username!: string;

  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    },
    {
      message:
        'Password must be at least 8 characters long, including at least one uppercase letter, one lowercase letter, one number, and one special character.',
    },
  )
  readonly password!: string;
}
