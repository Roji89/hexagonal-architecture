import { Product, ProductStatus } from '@domain/entities/product/product.entity';
import { ProductEntity } from '../entities/product.entity';

export class ProductEntityMapper {
  static toDomain(entity: ProductEntity): Product {
    return Product.fromPersistence(
      entity.id,
      entity.name,
      entity.description,
      entity.price,
      entity.currency,
      entity.stockQuantity,
      entity.status as ProductStatus,
      entity.sku,
      entity.category,
      entity.createdAt,
      entity.updatedAt
    );
  }

  static toEntity(domain: Product): ProductEntity {
    const entity = new ProductEntity();
    entity.id = domain.getId();
    entity.name = domain.getName();
    entity.description = domain.getDescription();
    entity.price = domain.getPrice().getAmount();
    entity.currency = domain.getPrice().getCurrency();
    entity.stockQuantity = domain.getStockQuantity();
    entity.status = domain.getStatus();
    entity.sku = domain.getSku();
    entity.category = domain.getCategory();
    entity.createdAt = domain.getCreatedAt();
    entity.updatedAt = domain.getUpdatedAt();

    return entity;
  }
}
