import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectMapper()
    private readonly autoMapper: Mapper,
  ) {}

  /**
   * fetch a user by email
   * @param email user email
   * @returns existing user or throw not found exception
   */
  async getUserByEmail(email: string): Promise<UserResponseDto> {
    try {
      this.logger.log(`Input email ${email}`);
      const user = await this.userRepository.findOneByOrFail({ email: email });
      this.logger.log(
        `Found a user ${JSON.stringify(user)} with email ${email}`,
      );
      return user;
    } catch (error) {
      this.logger.error(`The user was not found by ${email}`);
      throw new NotFoundException(`The user has ${email} does not exist`);
    }
  }

  /**
   * fetch all existing users in database
   * @returns existing users
   */
  async getUsers(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findBy({ isDelete: false });
    return this.autoMapper.mapArray(users, User, UserResponseDto);
  }

  /**
   * Create new user and save into database
   * @param userDto Username and email would be created
   * @returns a user
   */
  async createUser(userDto: CreateUserDto): Promise<UserResponseDto> {
    const isExist = await this.userRepository.findOneBy({
      email: userDto.email,
    });

    if (isExist) {
      this.logger.debug(`This email ${userDto.email} is existing in database`);
      throw new ConflictException(
        `The ${userDto.email} has already been registered`,
      );
    }

    const user = this.userRepository.create(userDto);
    await this.userRepository.save(user);
    this.logger.log(`${user.name} - ${user.email} has saved successfully`);

    return this.autoMapper.map(user, User, UserResponseDto);
  }
}
