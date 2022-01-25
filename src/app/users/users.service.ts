import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions, FindOneOptions, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll() {
    return await this.userRepository.find({
      select: ['id', 'firstName', 'lastName', 'email'],
    });
  }

  // Esse conditions e options é para não precisar fazer uma condição para cada busca Ex: 'findByEmail()'
  async findOneOrFail(
    conditions: FindConditions<UserEntity>,
    options?: FindOneOptions<UserEntity>,
  ) {
    try {
      return await this.userRepository.findOneOrFail(conditions, options);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async store(data: CreateUserDto) {
    const user = await this.userRepository.create(data);
    return await this.userRepository.save(user);
  }

  async update(id: string, data: UpdateUserDto) {
    const user = await this.findOneOrFail({ id });
    this.userRepository.merge(user, data);
    return await this.userRepository.save(user);
  }

  async destroy(id: string) {
    await this.findOneOrFail({ id });
    this.userRepository.softDelete({ id });
  }
}
