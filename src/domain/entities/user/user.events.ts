import { BaseDomainEvent } from '../../events/base-domain-event';

export class UserCreatedEvent extends BaseDomainEvent {
  constructor(
    aggregateId: string,
    public readonly email: string,
    public readonly name: string
  ) {
    super(aggregateId, 'UserCreated');
  }
}

export class UserEmailChangedEvent extends BaseDomainEvent {
  constructor(
    aggregateId: string,
    public readonly oldEmail: string,
    public readonly newEmail: string
  ) {
    super(aggregateId, 'UserEmailChanged');
  }
}

export class UserActivatedEvent extends BaseDomainEvent {
  constructor(aggregateId: string) {
    super(aggregateId, 'UserActivated');
  }
}

export class UserDeactivatedEvent extends BaseDomainEvent {
  constructor(aggregateId: string) {
    super(aggregateId, 'UserDeactivated');
  }
}
