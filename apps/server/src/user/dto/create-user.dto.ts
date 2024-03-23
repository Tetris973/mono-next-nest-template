import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsStrongPassword,
  IsIn,
  ValidateIf,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(32)
  readonly username: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  readonly password: string;

  // This is a custom validation rule that checks if the confirmPassword field is equal to the password field
  // The IsIn decorator with empty array is used to always fail the validation, because the confirmPassword value is never IN the empty array
  // The ValidateIf decorator is used to only run IsIn validation if the password field is not equal to the confirmPassword field
  @IsIn([], {
    message: 'Password do not match',
  })
  @ValidateIf((o) => o.password !== o.confirmPassword)
  readonly confirmPassword: string;
}
