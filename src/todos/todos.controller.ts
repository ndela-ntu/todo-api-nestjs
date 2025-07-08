import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { Todo, UserRole } from '@prisma/client';
import { ParseObjectPipe } from 'src/common/pipes/parse-object-id.pipe';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { TodoOwnershipGuard } from 'src/common/guards/todo-ownership.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('todos')
@ApiBearerAuth()
@Controller('todos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @ApiOperation({
    summary: 'Create a todo',
    description: 'This is used to create a todo',
  })
  @ApiBody({ type: CreateTodoDto })
  @Post()
  async create(
    @Body() createTodoDto: CreateTodoDto,
    @CurrentUser() user: any,
  ): Promise<Todo> {
    return this.todosService.create(createTodoDto, user.id);
  }

  @ApiOperation({
    summary: 'Get all todos',
    description:
      'Admins can fetch todos for any user by providing `userId`. Regular users can only fetch their own todos.',
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'ID of the user whose todos to fetch (Admin only)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Get()
  async findAll(
    @CurrentUser() user: any,
    @Query('userId') userId?: string,
  ): Promise<Todo[]> {
    if (user.role === UserRole.ADMIN) {
      return this.todosService.findAll(userId);
    }

    return this.todosService.findAll(user.id);
  }

  @ApiOperation({
    summary: 'Get todos by user ID',
    description:
      'Admins can fetch todos for any user. Regular users can only fetch their own todos (will be auto-restricted).',
  })
  @ApiParam({
    name: 'userId',
    type: String,
    description: 'ID of the user whose todos to fetch',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Get('user/:userId')
  findByUser(@Param('userId') userId: string, @CurrentUser() user: any) {
    if (user.role === UserRole.ADMIN) {
      return this.todosService.findByUser(userId);
    }

    return this.todosService.findByUser(userId);
  }

  @ApiOperation({
    summary: 'Returns one todo found by ID',
    description: 'Find one todo by ID',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID of the todo you want to fetch',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Get(':id')
  @UseGuards(TodoOwnershipGuard)
  async findOne(
    @Param('id', ParseObjectPipe) id: string,
  ): Promise<Todo | null> {
    return this.todosService.findOne(id);
  }

  @ApiBody({
    type: UpdateTodoDto,
  })
  @ApiOperation({
    summary: 'Update a todo',
    description: 'This is used to update a todo',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The id of the todo you want to update',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Patch(':id')
  @UseGuards(TodoOwnershipGuard)
  async update(
    @Param('id', ParseObjectPipe) id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<Todo> {
    return this.todosService.update(id, updateTodoDto);
  }

  @ApiOperation({
    summary: 'Delete a todo',
    description: 'This is used to delete a todo',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The id of the todo you want to delete',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Delete(':id')
  @UseGuards(TodoOwnershipGuard)
  async remove(@Param('id', ParseObjectPipe) id: string) {
    return this.todosService.remove(id);
  }
}
