import { Body, Controller, Get, Param, Post, Version } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import {
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Version('1')
  @ApiOperation({ summary: 'Get all existing users' })
  @ApiResponse({
    status: 200,
    description: 'List of user',
    type: [UserResponseDto],
  })
  async getUsers(): Promise<UserResponseDto[]> {
    return this.userService.getUsers();
  }

  @Get('email/:email')
  @Version('1')
  @ApiOperation({ summary: 'Get user by user email' })
  @ApiParam({
    name: 'email',
    type: 'string',
    required: true,
    example: 'test@gmail.com',
  })
  @ApiNotFoundResponse({ description: 'Not found user email' })
  @ApiResponse({
    status: 200,
    description: 'User infomation',
    type: UserResponseDto,
  })
  async getUserByEmail(
    @Param('email') email: string,
  ): Promise<UserResponseDto> {
    return this.userService.getUserByEmail(email);
  }

  @Post()
  @Version('1')
  @ApiOperation({ summary: 'Create new user' })
  @ApiConflictResponse({
    description: 'User infomation has already registered',
  })
  @ApiResponse({
    status: 201,
    description: 'User is created successfully',
    type: CreateUserDto,
  })
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.createUser(createUserDto);
  }
}
