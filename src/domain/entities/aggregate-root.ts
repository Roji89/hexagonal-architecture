import { DomainEvent } from '../events/domain-event.interface';

export abstract class AggregateRoot {
  private _domainEvents: DomainEvent[] = [];

  public getDomainEvents(): DomainEvent[] {
    return [...this._domainEvents];
  }

  public addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  public clearDomainEvents(): void {
    this._domainEvents = [];
  }

  protected markAsModified(): void {
    // This can be used for tracking changes
  }
}
