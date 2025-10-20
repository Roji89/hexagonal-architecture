import { Product, ProductStatus } from '@domain/entities/product/product.entity';
import { IProductRepository } from '@infrastructure/ports/product-repository.interface';
import { Like, Repository } from 'typeorm';
import { ProductEntity } from '../entities/product.entity';
import { ProductEntityMapper } from '../mappers/product-entity.mapper';

export class TypeOrmProductRepository implements IProductRepository {
  constructor(private readonly repository: Repository<ProductEntity>) {}

  async findById(id: string): Promise<Product | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? ProductEntityMapper.toDomain(entity) : null;
  }

  async findBySku(sku: string): Promise<Product | null> {
    const entity = await this.repository.findOne({ where: { sku } });
    return entity ? ProductEntityMapper.toDomain(entity) : null;
  }

  async findByCategory(category: string): Promise<Product[]> {
    const entities = await this.repository.find({ where: { category } });
    return entities.map(ProductEntityMapper.toDomain);
  }

  async findByStatus(status: ProductStatus): Promise<Product[]> {
    const entities = await this.repository.find({ where: { status } });
    return entities.map(ProductEntityMapper.toDomain);
  }

  async findAvailableProducts(): Promise<Product[]> {
    const entities = await this.repository.find({
      where: {
        status: ProductStatus.ACTIVE
      }
    });
    return entities.map(ProductEntityMapper.toDomain);
  }

  async findLowStockProducts(threshold: number): Promise<Product[]> {
    const entities = await this.repository
      .createQueryBuilder('product')
      .where('product.stockQuantity <= :threshold', { threshold })
      .andWhere('product.status = :status', { status: ProductStatus.ACTIVE })
      .getMany();

    return entities.map(ProductEntityMapper.toDomain);
  }

  async searchByName(name: string): Promise<Product[]> {
    const entities = await this.repository.find({
      where: { name: Like(`%${name}%`) }
    });
    return entities.map(ProductEntityMapper.toDomain);
  }

  async findAll(): Promise<Product[]> {
    const entities = await this.repository.find();
    return entities.map(ProductEntityMapper.toDomain);
  }

  async save(product: Product): Promise<Product> {
    const entity = ProductEntityMapper.toEntity(product);
    const savedEntity = await this.repository.save(entity);
    return ProductEntityMapper.toDomain(savedEntity);
  }

  async update(product: Product): Promise<Product> {
    const entity = ProductEntityMapper.toEntity(product);
    await this.repository.update(entity.id, entity);
    return product;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.repository.count({ where: { id } });
    return count > 0;
  }

  async skuExists(sku: string): Promise<boolean> {
    const count = await this.repository.count({ where: { sku } });
    return count > 0;
  }
}
