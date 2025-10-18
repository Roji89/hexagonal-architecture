import { BaseDomainEvent } from '../../events/base-domain-event';

export class OrderCreatedEvent extends BaseDomainEvent {
  constructor(
    aggregateId: string,
    public readonly customerId: string,
    public readonly totalAmount: number,
    public readonly currency: string,
    public readonly itemCount: number
  ) {
    super(aggregateId, 'OrderCreated');
  }
}

export class OrderPaidEvent extends BaseDomainEvent {
  constructor(
    aggregateId: string,
    public readonly paymentId: string,
    public readonly amount: number,
    public readonly currency: string
  ) {
    super(aggregateId, 'OrderPaid');
  }
}

export class OrderShippedEvent extends BaseDomainEvent {
  constructor(
    aggregateId: string,
    public readonly trackingNumber: string,
    public readonly shippingCarrier: string
  ) {
    super(aggregateId, 'OrderShipped');
  }
}

export class OrderDeliveredEvent extends BaseDomainEvent {
  constructor(
    aggregateId: string,
    public readonly deliveryDate: Date
  ) {
    super(aggregateId, 'OrderDelivered');
  }
}

export class OrderCancelledEvent extends BaseDomainEvent {
  constructor(
    aggregateId: string,
    public readonly reason: string
  ) {
    super(aggregateId, 'OrderCancelled');
  }
}

export class OrderItemAddedEvent extends BaseDomainEvent {
  constructor(
    aggregateId: string,
    public readonly productId: string,
    public readonly quantity: number,
    public readonly unitPrice: number,
    public readonly currency: string
  ) {
    super(aggregateId, 'OrderItemAdded');
  }
}

export class OrderItemRemovedEvent extends BaseDomainEvent {
  constructor(
    aggregateId: string,
    public readonly productId: string
  ) {
    super(aggregateId, 'OrderItemRemoved');
  }
}
