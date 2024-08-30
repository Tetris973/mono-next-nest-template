import { IsNotEmpty, IsString, MaxLength, MinLength, IsStrongPassword, ValidateIf, IsEmpty } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(32)
  readonly username!: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  readonly password!: string;

  // This is a custom validation rule that checks if the confirmPassword field is equal to the password field.
  // The IsEmpty & IsNotEMpty decorators are used to always fail the validation.
  // The ValidateIf decorator is used to only run the other validations if the password field is not equal to the confirmPassword field
  // Change history:
  // - The IsIn decorator was replaced with IsEmpty & IsNotmepty decorators because it wasn't showing correct type in swagger
  @IsEmpty({ message: 'password do not match' }) // IsEmpty & IsNotEMpty are required! do not remove
  @IsNotEmpty({ message: 'password do not match' })
  @ValidateIf((o) => o.password !== o.confirmPassword)
  readonly confirmPassword!: string;
}
