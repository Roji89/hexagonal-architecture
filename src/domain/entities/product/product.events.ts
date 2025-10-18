import { BaseDomainEvent } from '../../events/base-domain-event';

export class ProductCreatedEvent extends BaseDomainEvent {
  constructor(
    aggregateId: string,
    public readonly name: string,
    public readonly price: number,
    public readonly currency: string
  ) {
    super(aggregateId, 'ProductCreated');
  }
}

export class ProductPriceChangedEvent extends BaseDomainEvent {
  constructor(
    aggregateId: string,
    public readonly oldPrice: number,
    public readonly newPrice: number,
    public readonly currency: string
  ) {
    super(aggregateId, 'ProductPriceChanged');
  }
}

export class ProductStockUpdatedEvent extends BaseDomainEvent {
  constructor(
    aggregateId: string,
    public readonly oldStock: number,
    public readonly newStock: number
  ) {
    super(aggregateId, 'ProductStockUpdated');
  }
}

export class ProductActivatedEvent extends BaseDomainEvent {
  constructor(aggregateId: string) {
    super(aggregateId, 'ProductActivated');
  }
}

export class ProductDeactivatedEvent extends BaseDomainEvent {
  constructor(aggregateId: string) {
    super(aggregateId, 'ProductDeactivated');
  }
}
