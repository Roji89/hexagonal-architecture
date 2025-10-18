import { v4 as uuidv4 } from 'uuid';
import { DomainEvent } from './domain-event.interface';

export abstract class BaseDomainEvent implements DomainEvent {
  public readonly eventId: string;
  public readonly occurredOn: Date;
  public readonly eventVersion: number = 1;

  constructor(
    public readonly aggregateId: string,
    public readonly eventType: string
  ) {
    this.eventId = uuidv4();
    this.occurredOn = new Date();
  }
}
