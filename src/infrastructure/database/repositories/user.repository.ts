import { User, UserStatus } from '@domain/entities/user/user.entity';
import { IUserRepository } from '@infrastructure/ports/user-repository.interface';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { UserEntityMapper } from '../mappers/user-entity.mapper';

export class TypeOrmUserRepository implements IUserRepository {
  constructor(private readonly repository: Repository<UserEntity>) {}

  async findById(id: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? UserEntityMapper.toDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { email } });
    return entity ? UserEntityMapper.toDomain(entity) : null;
  }

  async findByStatus(status: UserStatus): Promise<User[]> {
    const entities = await this.repository.find({ where: { status } });
    return entities.map(UserEntityMapper.toDomain);
  }

  async findActiveUsers(): Promise<User[]> {
    return this.findByStatus(UserStatus.ACTIVE);
  }

  async findAll(): Promise<User[]> {
    const entities = await this.repository.find();
    return entities.map(UserEntityMapper.toDomain);
  }

  async save(user: User): Promise<User> {
    const entity = UserEntityMapper.toEntity(user);
    const savedEntity = await this.repository.save(entity);
    return UserEntityMapper.toDomain(savedEntity);
  }

  async update(user: User): Promise<User> {
    const entity = UserEntityMapper.toEntity(user);
    await this.repository.update(entity.id, entity);
    return user;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.repository.count({ where: { id } });
    return count > 0;
  }

  async emailExists(email: string): Promise<boolean> {
    const count = await this.repository.count({ where: { email } });
    return count > 0;
  }
}
