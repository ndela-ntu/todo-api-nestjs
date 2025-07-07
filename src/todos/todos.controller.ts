import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { Todo, UserRole } from '@prisma/client';
import { ParseObjectPipe } from 'src/common/pipes/parse-object-id.pipe';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { TodoOwnershipGuard } from 'src/common/guards/todo-ownership.guard';

@Controller('todos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  async create(@Body() createTodoDto: CreateTodoDto, @CurrentUser() user: any): Promise<Todo> {
    return this.todosService.create(createTodoDto, user.id);
  }

  @Get()
  async findAll(@CurrentUser() user: any, @Query('userId') userId?: string): Promise<Todo[]> {
    if (user.role === UserRole.ADMIN) {
      return this.todosService.findAll(userId);
    }

    return this.todosService.findAll(user.id)
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string, @CurrentUser() user: any) {
    if (user.role === UserRole.ADMIN) {
      return this.todosService.findByUser(userId);
    }

    return this.todosService.findByUser(userId);
  }

  @Get(':id')
  @UseGuards(TodoOwnershipGuard)
  async findOne(@Param('id', ParseObjectPipe) id: string): Promise<Todo | null> {
    return this.todosService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(TodoOwnershipGuard)
  async update(@Param('id', ParseObjectPipe) id: string, @Body() updateTodoDto: UpdateTodoDto,): Promise<Todo> {
    return this.todosService.update(id, updateTodoDto);
  }

  @Delete(':id')
  @UseGuards(TodoOwnershipGuard)
  async remove(@Param('id', ParseObjectPipe) id: string) {
    return this.todosService.remove(id);
  }
}
