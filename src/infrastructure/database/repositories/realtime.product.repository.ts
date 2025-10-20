import { Product } from '@domain/entities/product/product.entity';
import { EventEmitter } from 'events';
import { Repository } from 'typeorm';
import { ProductEntity } from '../entities/product.entity';
import { TypeOrmProductRepository } from './product.repository';

export class RealtimeProductRepository extends TypeOrmProductRepository {
  constructor(
    repository: Repository<ProductEntity>,
    private eventEmitter: EventEmitter,
    private lowStockThreshold: number = 10
  ) {
    super(repository);
  }

  async save(product: Product): Promise<Product> {
    try {
      // Get old stock before saving
      const productId = product.getId(); // ✅ Use public method
      const oldProduct = await this.findById(productId);
      const oldStock = oldProduct?.getStockQuantity() || 0;
      const newStock = product.getStockQuantity(); // ✅ No await needed

      // Save first - emit events only if successful
      const savedProduct = await super.save(product);

      // Emit events after successful save
      if (oldStock !== newStock) {
        this.notifyStockChange(savedProduct, oldStock, newStock);
      }

      return savedProduct;
    } catch (error) {
      // ✅ Don't emit events if save fails
      console.error('Failed to save product:', error);
      throw error;
    }
  }

  private notifyStockChange(product: Product, oldStock: number, newStock: number): void {
    const productId = product.getId();

    // Emit stock change event
    this.eventEmitter.emit('productStockChanged', {
      productId,
      oldStock,
      newStock,
      timestamp: new Date()
    });

    // Check for low stock
    if (newStock <= this.lowStockThreshold && oldStock > this.lowStockThreshold) {
      // ✅ Only emit when crossing threshold (not every time it's low)
      this.eventEmitter.emit('productLowStock', {
        productId,
        stock: newStock,
        threshold: this.lowStockThreshold,
        timestamp: new Date()
      });
    }
  }
}
