import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: "The user's email",
    type: 'string',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "The user's password",
    type: 'string',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({
    description: "The user's name",
    type: 'string',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: "The user's role",
    enum: ['ADMIN', 'USER'],
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}

export class LoginDto {
  @ApiProperty({
    description: "The user's email",
    type: 'string',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "The user's password",
    type: 'string',
  })
  @ApiProperty()
  @IsString()
  password: string;
}
