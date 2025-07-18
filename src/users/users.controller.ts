import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User as UserModel, UserRole } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ParseObjectPipe } from 'src/common/pipes/parse-object-id.pipe';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: 'Create a user',
    description: 'This is used to create a user',
  })
  @ApiBody({ type: CreateUserDto })
  @Post()
  @Roles(UserRole.ADMIN)
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({
    summary: 'Get all users (Admin only)',
    description: "Admins can fetch all users. Regular users can't",
  })
  @Get()
  @Roles(UserRole.ADMIN)
  async findAll() {
    console.log('Getting all users');
    return this.usersService.findAll();
  }

  @ApiOperation({
    summary: 'Get current user profile',
    description: 'Returns the profile of the authenticated user.',
  })
  @Get('profile')
  getProfile(@CurrentUser() user: any) {
    return this.usersService.findOne(user.id);
  }

  @ApiOperation({
    summary: 'Get user profile by ID',
    description: 'Returns the profile of the specified user using an ID.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID of the user whose profile is being fetch',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Get(':id')
  @Roles(UserRole.ADMIN)
  async findOne(@Param('id', ParseObjectPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update your own profile',
    description:
      'Allows authenticated users to update their own profile information.',
  })
  @ApiBody({
    type: UpdateUserDto,
  })
  @Patch('profile')
  updateProfile(
    @CurrentUser() user: any,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(user.id, updateUserDto);
  }

  @ApiOperation({
    summary: 'Update any user (Admin only)',
    description:
      'Allows administrators to update any user profile by specifying the user ID.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID of the user to update',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdateUserDto })
  @Patch(':id')
  async update(
    @Param('id', ParseObjectPipe) id: string,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiOperation({
    summary: 'Delete a user (Admin only)',
    description:
      'Permanently deletes a user account. Requires admin privileges.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID of the user to delete',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseObjectPipe) id: string) {
    return this.usersService.remove(id);
  }
}
