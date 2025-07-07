import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TodoOwnershipGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const todoId = request.params.id;

    if (user.role === UserRole.ADMIN) {
      return true;
    }

    const todo = await this.prisma.todo.findUnique({
      where: { id: todoId },
      select: { userId: true },
    });

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    return todo.userId === user.userId;
  }
}
