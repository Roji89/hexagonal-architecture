import { Money } from '../../value-objects/money';

export class OrderItem {
  private constructor(
    private readonly _productId: string,
    private readonly _productName: string,
    private readonly _unitPrice: Money,
    private readonly _quantity: number
  ) {
    if (_quantity <= 0) {
      throw new Error('Quantity must be positive');
    }
  }

  public static create(
    productId: string,
    productName: string,
    unitPrice: Money,
    quantity: number
  ): OrderItem {
    if (!productId?.trim()) throw new Error('Product ID is required');
    if (!productName?.trim()) throw new Error('Product name is required');

    return new OrderItem(productId, productName, unitPrice, quantity);
  }

  public getProductId(): string {
    return this._productId;
  }

  public getProductName(): string {
    return this._productName;
  }

  public getUnitPrice(): Money {
    return this._unitPrice;
  }

  public getQuantity(): number {
    return this._quantity;
  }

  public getTotalPrice(): Money {
    return this._unitPrice.multiply(this._quantity);
  }

  public equals(other: OrderItem): boolean {
    return this._productId === other._productId;
  }
}
