import { Order, OrderStatus } from '@domain/entities/order/order.entity';
import { IOrderRepository } from '@infrastructure/ports/order-repository.interface';
import { Between, Repository } from 'typeorm';
import { OrderEntity } from '../entities/order.entity';
import { OrderEntityMapper } from '../mappers/order-entity.mapper';

export class TypeOrmOrderRepository implements IOrderRepository {
  constructor(private readonly repository: Repository<OrderEntity>) {}

  async findById(id: string): Promise<Order | null> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['items']
    });
    return entity ? OrderEntityMapper.toDomain(entity) : null;
  }

  async findByUserId(userId: string): Promise<Order[]> {
    const entities = await this.repository.find({
      where: { customerId: userId },
      relations: ['items'],
      order: { createdAt: 'DESC' }
    });
    return entities.map(OrderEntityMapper.toDomain);
  }

  async findByStatus(status: OrderStatus): Promise<Order[]> {
    const entities = await this.repository.find({
      where: { status },
      relations: ['items']
    });
    return entities.map(OrderEntityMapper.toDomain);
  }

  async findByUserAndStatus(userId: string, status: OrderStatus): Promise<Order[]> {
    const entities = await this.repository.find({
      where: {
        customerId: userId,
        status
      },
      relations: ['items']
    });
    return entities.map(OrderEntityMapper.toDomain);
  }

  async findRecentOrders(userId: string, limit: number): Promise<Order[]> {
    const entities = await this.repository.find({
      where: { customerId: userId },
      relations: ['items'],
      order: { createdAt: 'DESC' },
      take: limit
    });
    return entities.map(OrderEntityMapper.toDomain);
  }

  async findOrdersInDateRange(startDate: Date, endDate: Date): Promise<Order[]> {
    const entities = await this.repository.find({
      where: {
        createdAt: Between(startDate, endDate)
      },
      relations: ['items']
    });
    return entities.map(OrderEntityMapper.toDomain);
  }

  async countOrdersByUser(userId: string): Promise<number> {
    return this.repository.count({ where: { customerId: userId } });
  }

  async findAll(): Promise<Order[]> {
    const entities = await this.repository.find({ relations: ['items'] });
    return entities.map(OrderEntityMapper.toDomain);
  }

  async save(order: Order): Promise<Order> {
    const entity = OrderEntityMapper.toEntity(order);
    const savedEntity = await this.repository.save(entity);
    // Reload with relations
    const reloadedEntity = await this.repository.findOne({
      where: { id: savedEntity.id },
      relations: ['items']
    });
    return OrderEntityMapper.toDomain(reloadedEntity!);
  }

  async update(order: Order): Promise<Order> {
    const entity = OrderEntityMapper.toEntity(order);
    await this.repository.save(entity); // save() handles updates too
    return order;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.repository.count({ where: { id } });
    return count > 0;
  }
}
