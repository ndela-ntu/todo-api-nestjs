import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { Todo } from '@prisma/client';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodosService {
  constructor(private prisma: PrismaService) {}

  async create(createTodoDto: CreateTodoDto, userId: string) {
    const todo = await this.prisma.todo.create({
      data: {
        ...createTodoDto,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return todo;
  }

  async findAll(userId?: string) {
    const whereClause = userId ? { userId } : {};

    return this.prisma.todo.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const todo = await this.prisma.todo.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    return todo;
  }

  async findByUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.todo.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(id: string, updateTodoDto: UpdateTodoDto) {
    const existingTodo = await this.prisma.todo.findUnique({
      where: { id },
    });

    if (!existingTodo) {
      throw new NotFoundException('Todo not found');
    }

    const todo = await this.prisma.todo.update({
      where: { id },
      data: updateTodoDto,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return todo;
  }

  async remove(id: string) {
    const existingTodo = await this.prisma.todo.findUnique({ where: { id } });

    if (!existingTodo) {
      throw new NotFoundException('Todo not found');
    }

    await this.prisma.todo.delete({ where: { id } });
    return { message: 'Todo deleted successfully' };
  }
}
