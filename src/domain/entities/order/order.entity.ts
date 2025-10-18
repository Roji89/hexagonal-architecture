import { v4 as uuidv4 } from 'uuid';
import { Address } from '../../value-objects/address';
import { Money } from '../../value-objects/money';
import { AggregateRoot } from '../aggregate-root';
import { OrderItem } from './order-item';
import {
  OrderCancelledEvent,
  OrderCreatedEvent,
  OrderDeliveredEvent,
  OrderItemAddedEvent,
  OrderItemRemovedEvent,
  OrderPaidEvent,
  OrderShippedEvent
} from './order.events';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PAID = 'paid',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

export class Order extends AggregateRoot {
  private constructor(
    private readonly _id: string,
    private readonly _customerId: string,
    private _items: OrderItem[],
    private _status: OrderStatus,
    private _shippingAddress: Address,
    private _billingAddress: Address,
    private _paymentId?: string,
    private _trackingNumber?: string,
    private _notes?: string,
    private _createdAt?: Date,
    private _updatedAt?: Date
  ) {
    super();
    this._createdAt = this._createdAt || new Date();
    this._updatedAt = this._updatedAt || new Date();
  }

  // Factory method for creating new orders
  public static create(
    customerId: string,
    items: OrderItem[],
    shippingAddress: Address,
    billingAddress?: Address
  ): Order {
    const id = uuidv4();

    if (!customerId?.trim()) throw new Error('Customer ID is required');
    if (!items || items.length === 0) throw new Error('Order must have at least one item');

    const order = new Order(
      id,
      customerId,
      [...items], // Create a copy
      OrderStatus.PENDING,
      shippingAddress,
      billingAddress || shippingAddress
    );

    const total = order.calculateTotal();

    // Domain event
    order.addDomainEvent(new OrderCreatedEvent(
      id,
      customerId,
      total.getAmount(),
      total.getCurrency(),
      items.length
    ));

    return order;
  }

  // Factory method for reconstituting from persistence
  public static fromPersistence(
    id: string,
    customerId: string,
    items: OrderItem[],
    status: OrderStatus,
    shippingAddress: Address,
    billingAddress: Address,
    paymentId?: string,
    trackingNumber?: string,
    notes?: string,
    createdAt?: Date,
    updatedAt?: Date
  ): Order {
    return new Order(
      id,
      customerId,
      items,
      status,
      shippingAddress,
      billingAddress,
      paymentId,
      trackingNumber,
      notes,
      createdAt,
      updatedAt
    );
  }

  // Getters
  public getId(): string {
    return this._id;
  }

  public getCustomerId(): string {
    return this._customerId;
  }

  public getItems(): OrderItem[] {
    return [...this._items]; // Return a copy
  }

  public getStatus(): OrderStatus {
    return this._status;
  }

  public getShippingAddress(): Address {
    return this._shippingAddress;
  }

  public getBillingAddress(): Address {
    return this._billingAddress;
  }

  public getPaymentId(): string | undefined {
    return this._paymentId;
  }

  public getTrackingNumber(): string | undefined {
    return this._trackingNumber;
  }

  public getNotes(): string | undefined {
    return this._notes;
  }

  public getCreatedAt(): Date {
    return this._createdAt!;
  }

  public getUpdatedAt(): Date {
    return this._updatedAt!;
  }

  // Business methods
  public addItem(item: OrderItem): void {
    if (!this.canModifyItems()) {
      throw new Error('Cannot modify items in current order status');
    }

    // Check if item already exists
    const existingIndex = this._items.findIndex(i => i.equals(item));
    if (existingIndex >= 0) {
      throw new Error('Item already exists in order');
    }

    this._items.push(item);
    this._updatedAt = new Date();
    this.markAsModified();

    this.addDomainEvent(new OrderItemAddedEvent(
      this._id,
      item.getProductId(),
      item.getQuantity(),
      item.getUnitPrice().getAmount(),
      item.getUnitPrice().getCurrency()
    ));
  }

  public removeItem(productId: string): void {
    if (!this.canModifyItems()) {
      throw new Error('Cannot modify items in current order status');
    }

    const itemIndex = this._items.findIndex(item => item.getProductId() === productId);
    if (itemIndex === -1) {
      throw new Error('Item not found in order');
    }

    this._items.splice(itemIndex, 1);

    if (this._items.length === 0) {
      throw new Error('Order must have at least one item');
    }

    this._updatedAt = new Date();
    this.markAsModified();

    this.addDomainEvent(new OrderItemRemovedEvent(this._id, productId));
  }

  public confirm(): void {
    if (this._status !== OrderStatus.PENDING) {
      throw new Error('Only pending orders can be confirmed');
    }

    this._status = OrderStatus.CONFIRMED;
    this._updatedAt = new Date();
    this.markAsModified();
  }

  public markAsPaid(paymentId: string): void {
    if (!paymentId?.trim()) throw new Error('Payment ID is required');

    if (this._status !== OrderStatus.CONFIRMED) {
      throw new Error('Only confirmed orders can be marked as paid');
    }

    this._status = OrderStatus.PAID;
    this._paymentId = paymentId;
    this._updatedAt = new Date();
    this.markAsModified();

    const total = this.calculateTotal();
    this.addDomainEvent(new OrderPaidEvent(
      this._id,
      paymentId,
      total.getAmount(),
      total.getCurrency()
    ));
  }

  public startProcessing(): void {
    if (this._status !== OrderStatus.PAID) {
      throw new Error('Only paid orders can start processing');
    }

    this._status = OrderStatus.PROCESSING;
    this._updatedAt = new Date();
    this.markAsModified();
  }

  public ship(trackingNumber: string, carrier: string): void {
    if (!trackingNumber?.trim()) throw new Error('Tracking number is required');
    if (!carrier?.trim()) throw new Error('Carrier is required');

    if (this._status !== OrderStatus.PROCESSING) {
      throw new Error('Only processing orders can be shipped');
    }

    this._status = OrderStatus.SHIPPED;
    this._trackingNumber = trackingNumber;
    this._updatedAt = new Date();
    this.markAsModified();

    this.addDomainEvent(new OrderShippedEvent(
      this._id,
      trackingNumber,
      carrier
    ));
  }

  public deliver(): void {
    if (this._status !== OrderStatus.SHIPPED) {
      throw new Error('Only shipped orders can be delivered');
    }

    this._status = OrderStatus.DELIVERED;
    this._updatedAt = new Date();
    this.markAsModified();

    this.addDomainEvent(new OrderDeliveredEvent(this._id, new Date()));
  }

  public cancel(reason: string): void {
    if (!reason?.trim()) throw new Error('Cancellation reason is required');

    if (!this.canBeCancelled()) {
      throw new Error('Order cannot be cancelled in current status');
    }

    this._status = OrderStatus.CANCELLED;
    this._notes = reason;
    this._updatedAt = new Date();
    this.markAsModified();

    this.addDomainEvent(new OrderCancelledEvent(this._id, reason));
  }

  public updateShippingAddress(address: Address): void {
    if (this._status !== OrderStatus.PENDING && this._status !== OrderStatus.CONFIRMED) {
      throw new Error('Cannot update shipping address after payment');
    }

    this._shippingAddress = address;
    this._updatedAt = new Date();
    this.markAsModified();
  }

  public addNotes(notes: string): void {
    this._notes = notes?.trim() || undefined;
    this._updatedAt = new Date();
    this.markAsModified();
  }

  // Calculation methods
  public calculateSubtotal(): Money {
    if (this._items.length === 0) {
      return Money.zero();
    }

    let total = this._items[0].getTotalPrice();
    for (let i = 1; i < this._items.length; i++) {
      total = total.add(this._items[i].getTotalPrice());
    }

    return total;
  }

  public calculateTax(rate: number = 0): Money {
    if (rate < 0 || rate > 1) {
      throw new Error('Tax rate must be between 0 and 1');
    }

    const subtotal = this.calculateSubtotal();
    return subtotal.multiply(rate);
  }

  public calculateShipping(cost: Money = Money.zero()): Money {
    return cost;
  }

  public calculateTotal(taxRate: number = 0, shippingCost?: Money): Money {
    const subtotal = this.calculateSubtotal();
    const tax = this.calculateTax(taxRate);
    const shipping = this.calculateShipping(shippingCost);

    return subtotal.add(tax).add(shipping);
  }

  public getItemCount(): number {
    return this._items.reduce((total, item) => total + item.getQuantity(), 0);
  }

  // Query methods
  public isPending(): boolean {
    return this._status === OrderStatus.PENDING;
  }

  public isConfirmed(): boolean {
    return this._status === OrderStatus.CONFIRMED;
  }

  public isPaid(): boolean {
    return this._status === OrderStatus.PAID;
  }

  public isShipped(): boolean {
    return this._status === OrderStatus.SHIPPED;
  }

  public isDelivered(): boolean {
    return this._status === OrderStatus.DELIVERED;
  }

  public isCancelled(): boolean {
    return this._status === OrderStatus.CANCELLED;
  }

  public canModifyItems(): boolean {
    return this._status === OrderStatus.PENDING;
  }

  public canBeCancelled(): boolean {
    return [
      OrderStatus.PENDING,
      OrderStatus.CONFIRMED,
      OrderStatus.PAID
    ].includes(this._status);
  }

  public canBeShipped(): boolean {
    return this._status === OrderStatus.PROCESSING;
  }

  public hasItem(productId: string): boolean {
    return this._items.some(item => item.getProductId() === productId);
  }
}
