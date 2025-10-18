import { v4 as uuidv4 } from 'uuid';
import { Money } from '../../value-objects/money';
import { AggregateRoot } from '../aggregate-root';
import {
  ProductActivatedEvent,
  ProductCreatedEvent,
  ProductDeactivatedEvent,
  ProductPriceChangedEvent,
  ProductStockUpdatedEvent
} from './product.events';

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  OUT_OF_STOCK = 'out_of_stock',
  DISCONTINUED = 'discontinued'
}

export class Product extends AggregateRoot {
  private constructor(
    private readonly _id: string,
    private _name: string,
    private _description: string,
    private _price: Money,
    private _stockQuantity: number,
    private _status: ProductStatus,
    private _sku: string,
    private _category: string,
    private _createdAt?: Date,
    private _updatedAt?: Date
  ) {
    super();
    this._createdAt = this._createdAt || new Date();
    this._updatedAt = this._updatedAt || new Date();
  }

  // Factory method for creating new products
  public static create(
    name: string,
    description: string,
    price: number,
    currency: string,
    stockQuantity: number,
    sku: string,
    category: string
  ): Product {
    const id = uuidv4();

    if (!name?.trim()) throw new Error('Product name is required');
    if (!description?.trim()) throw new Error('Product description is required');
    if (!sku?.trim()) throw new Error('Product SKU is required');
    if (!category?.trim()) throw new Error('Product category is required');
    if (stockQuantity < 0) throw new Error('Stock quantity cannot be negative');

    const priceVO = new Money(price, currency);
    const status = stockQuantity > 0 ? ProductStatus.ACTIVE : ProductStatus.OUT_OF_STOCK;

    const product = new Product(
      id,
      name.trim(),
      description.trim(),
      priceVO,
      stockQuantity,
      status,
      sku.trim().toUpperCase(),
      category.trim()
    );

    // Domain event
    product.addDomainEvent(new ProductCreatedEvent(
      id,
      name.trim(),
      priceVO.getAmount(),
      priceVO.getCurrency()
    ));

    return product;
  }

  // Factory method for reconstituting from persistence
  public static fromPersistence(
    id: string,
    name: string,
    description: string,
    price: number,
    currency: string,
    stockQuantity: number,
    status: ProductStatus,
    sku: string,
    category: string,
    createdAt?: Date,
    updatedAt?: Date
  ): Product {
    return new Product(
      id,
      name,
      description,
      new Money(price, currency),
      stockQuantity,
      status,
      sku,
      category,
      createdAt,
      updatedAt
    );
  }

  // Getters
  public getId(): string {
    return this._id;
  }

  public getName(): string {
    return this._name;
  }

  public getDescription(): string {
    return this._description;
  }

  public getPrice(): Money {
    return this._price;
  }

  public getStockQuantity(): number {
    return this._stockQuantity;
  }

  public getStatus(): ProductStatus {
    return this._status;
  }

  public getSku(): string {
    return this._sku;
  }

  public getCategory(): string {
    return this._category;
  }

  public getCreatedAt(): Date {
    return this._createdAt!;
  }

  public getUpdatedAt(): Date {
    return this._updatedAt!;
  }

  // Business methods
  public updatePrice(newPrice: number, currency?: string): void {
    const newPriceVO = new Money(newPrice, currency || this._price.getCurrency());

    if (this._price.equals(newPriceVO)) {
      return; // No change needed
    }

    const oldPrice = this._price.getAmount();
    this._price = newPriceVO;
    this._updatedAt = new Date();
    this.markAsModified();

    this.addDomainEvent(new ProductPriceChangedEvent(
      this._id,
      oldPrice,
      newPriceVO.getAmount(),
      newPriceVO.getCurrency()
    ));
  }

  public updateStock(newQuantity: number): void {
    if (newQuantity < 0) {
      throw new Error('Stock quantity cannot be negative');
    }

    const oldStock = this._stockQuantity;
    this._stockQuantity = newQuantity;
    this._updatedAt = new Date();

    // Update status based on stock
    if (newQuantity === 0 && this._status === ProductStatus.ACTIVE) {
      this._status = ProductStatus.OUT_OF_STOCK;
    } else if (newQuantity > 0 && this._status === ProductStatus.OUT_OF_STOCK) {
      this._status = ProductStatus.ACTIVE;
    }

    this.markAsModified();

    this.addDomainEvent(new ProductStockUpdatedEvent(
      this._id,
      oldStock,
      newQuantity
    ));
  }

  public reserveStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('Quantity must be positive');
    }

    if (!this.isAvailable()) {
      throw new Error('Product is not available for reservation');
    }

    if (this._stockQuantity < quantity) {
      throw new Error('Insufficient stock available');
    }

    this.updateStock(this._stockQuantity - quantity);
  }

  public releaseStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('Quantity must be positive');
    }

    this.updateStock(this._stockQuantity + quantity);
  }

  public updateDetails(name: string, description: string, category: string): void {
    if (!name?.trim()) throw new Error('Product name is required');
    if (!description?.trim()) throw new Error('Product description is required');
    if (!category?.trim()) throw new Error('Product category is required');

    this._name = name.trim();
    this._description = description.trim();
    this._category = category.trim();
    this._updatedAt = new Date();
    this.markAsModified();
  }

  public activate(): void {
    if (this._status === ProductStatus.DISCONTINUED) {
      throw new Error('Cannot activate discontinued product');
    }

    if (this._status === ProductStatus.ACTIVE) {
      return; // Already active
    }

    this._status = this._stockQuantity > 0 ? ProductStatus.ACTIVE : ProductStatus.OUT_OF_STOCK;
    this._updatedAt = new Date();
    this.markAsModified();

    this.addDomainEvent(new ProductActivatedEvent(this._id));
  }

  public deactivate(): void {
    if (this._status === ProductStatus.INACTIVE) {
      return; // Already inactive
    }

    this._status = ProductStatus.INACTIVE;
    this._updatedAt = new Date();
    this.markAsModified();

    this.addDomainEvent(new ProductDeactivatedEvent(this._id));
  }

  public discontinue(): void {
    this._status = ProductStatus.DISCONTINUED;
    this._updatedAt = new Date();
    this.markAsModified();
  }

  // Query methods
  public isAvailable(): boolean {
    return this._status === ProductStatus.ACTIVE && this._stockQuantity > 0;
  }

  public isActive(): boolean {
    return this._status === ProductStatus.ACTIVE;
  }

  public isInStock(): boolean {
    return this._stockQuantity > 0;
  }

  public canBeOrdered(quantity: number): boolean {
    return this.isAvailable() && this._stockQuantity >= quantity;
  }

  public calculateTotalPrice(quantity: number): Money {
    if (quantity <= 0) {
      throw new Error('Quantity must be positive');
    }

    return this._price.multiply(quantity);
  }
}
