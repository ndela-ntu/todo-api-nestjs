import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateTodoDto {
    
  @ApiProperty({
    description: "A todo'\s name",
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: "A todo'\s description",
    type: 'string',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: "A todo's status",
    type: 'boolean',
  })
  @IsBoolean()
  @IsNotEmpty()
  isComplete: boolean;

  @ApiPropertyOptional({
    description: 'The image of a completed todo',
  })
  @IsUrl()
  @IsOptional()
  completedTodoImage?: string;
}
