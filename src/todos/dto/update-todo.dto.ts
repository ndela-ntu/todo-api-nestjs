import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class UpdateTodoDto {
  @ApiPropertyOptional({
    description: "A todo'\s name",
    type: 'string',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: "A todo'\s description",
    type: 'string',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: "A todo's status",
    type: 'boolean',
  })
  @IsBoolean()
  @IsOptional()
  isComplete?: boolean;

  @ApiPropertyOptional({
    description: 'The image of a completed todo',
  })
  @IsUrl()
  @IsOptional()
  completedTodoImage?: string;
}
