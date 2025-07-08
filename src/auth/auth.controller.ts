import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: 'Register a user',
    description: 'This api endpoint is used to register a user'
  })
  @ApiBody({type: RegisterDto})
  @Post('register')
  @Public()
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiOperation({
    summary: 'Log a user in',
    description: 'This api endpoint is used to log a user in'
  })
  @ApiBody({type: LoginDto})
  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
