import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: "The user's email",
    type: 'string',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "The user's password",
    type: 'string',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({
    description: 'The user\'s name',
    type: 'string',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'The user\'s role',
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
