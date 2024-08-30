# Data Transfer Objects (DTOs)

DTOs transfer data between processes, usually through remote processes (e.g., backend to frontend or vice versa).

Key principles:
- Immutable after initialization, data should never be modified after initialization
- Used for data transfer only, should not perform any logic on its data. (If an object needs to perform logic on its data after initialization, it should be an entity or something else, not a DTO.)
- Serve as a contract for data validation

In this project:
- Immutability enforced by TypeScript using the `readonly` keyword
- Only predefined DTOs can be sent between backend and frontend, if a DTO is not defined and used, no data is sent.
- DTOs provides validation rules for the data they hold. All DTOs received in the backend are validated according to rules defined in the DTO.

Example DTO:

```typescript
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

  @IsEmpty({ message: 'password do not match' })
  @IsNotEmpty({ message: 'password do not match' })
  @ValidateIf((o) => o.password !== o.confirmPassword)
  readonly confirmPassword!: string;
}
```

Note: The `!` after attributes is used to tell TypeScript that these attributes will be initialized. This workaround can  be used here because dto in this project are initialized with class-transformer. Be carreful when using this workaroud for other exceptions.

