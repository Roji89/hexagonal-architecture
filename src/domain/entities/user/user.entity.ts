import { v4 as uuidv4 } from 'uuid';
import { Address } from '../../value-objects/address';
import { Email } from '../../value-objects/email';
import { AggregateRoot } from '../aggregate-root';
import {
  UserActivatedEvent,
  UserCreatedEvent,
  UserDeactivatedEvent,
  UserEmailChangedEvent
} from './user.events';

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

export class User extends AggregateRoot {
  private constructor(
    private readonly _id: string,
    private _email: Email,
    private _firstName: string,
    private _lastName: string,
    private _passwordHash: string,
    private _status: UserStatus,
    private _address?: Address,
    private _createdAt?: Date,
    private _updatedAt?: Date
  ) {
    super();
    this._createdAt = this._createdAt || new Date();
    this._updatedAt = this._updatedAt || new Date();
  }

  // Factory method for creating new users
  public static create(
    email: string,
    firstName: string,
    lastName: string,
    passwordHash: string,
    address?: Address
  ): User {
    const id = uuidv4();
    const emailVO = new Email(email);

    if (!firstName?.trim()) throw new Error('First name is required');
    if (!lastName?.trim()) throw new Error('Last name is required');
    if (!email?.trim()) throw new Error('email is required');
    if (!passwordHash?.trim()) throw new Error('Password hash is required');

    const user = new User(
      id,
      emailVO,
      firstName.trim(),
      lastName.trim(),
      passwordHash,
      UserStatus.ACTIVE,
      address
    );

    // Domain event
    user.addDomainEvent(new UserCreatedEvent(
      id,
      emailVO.getValue(),
      `${firstName} ${lastName}`
    ));

    return user;
  }

  // Factory method for reconstituting from persistence
  public static fromPersistence(
    id: string,
    email: string,
    firstName: string,
    lastName: string,
    passwordHash: string,
    status: UserStatus,
    address?: Address,
    createdAt?: Date,
    updatedAt?: Date
  ): User {
    return new User(
      id,
      new Email(email),
      firstName,
      lastName,
      passwordHash,
      status,
      address,
      createdAt,
      updatedAt
    );
  }

  // Getters
  public getId(): string {
    return this._id;
  }

  public getEmail(): Email {
    return this._email;
  }

  public getFirstName(): string {
    return this._firstName;
  }

  public getLastName(): string {
    return this._lastName;
  }

  public getFullName(): string {
    return `${this._firstName} ${this._lastName}`;
  }

  public getPasswordHash(): string {
    return this._passwordHash;
  }

  public getStatus(): UserStatus {
    return this._status;
  }

  public getAddress(): Address | undefined {
    return this._address;
  }

  public getCreatedAt(): Date {
    return this._createdAt!;
  }

  public getUpdatedAt(): Date {
    return this._updatedAt!;
  }

  // Business methods
  public changeEmail(newEmail: string): void {
    const newEmailVO = new Email(newEmail);
    const oldEmail = this._email.getValue();

    if (this._email.equals(newEmailVO)) {
      return; // No change needed
    }

    this._email = newEmailVO;
    this._updatedAt = new Date();
    this.markAsModified();

    this.addDomainEvent(new UserEmailChangedEvent(
      this._id,
      oldEmail,
      newEmailVO.getValue()
    ));
  }

  public updateAddress(address: Address): void {
    this._address = address;
    this._updatedAt = new Date();
    this.markAsModified();
  }

  public updatePassword(newPasswordHash: string): void {
    if (!newPasswordHash?.trim()) {
      throw new Error('Password hash is required');
    }

    this._passwordHash = newPasswordHash;
    this._updatedAt = new Date();
    this.markAsModified();
  }

  public activate(): void {
    if (this._status === UserStatus.ACTIVE) {
      return; // Already active
    }

    this._status = UserStatus.ACTIVE;
    this._updatedAt = new Date();
    this.markAsModified();

    this.addDomainEvent(new UserActivatedEvent(this._id));
  }

  public deactivate(): void {
    if (this._status === UserStatus.INACTIVE) {
      return; // Already inactive
    }

    this._status = UserStatus.INACTIVE;
    this._updatedAt = new Date();
    this.markAsModified();

    this.addDomainEvent(new UserDeactivatedEvent(this._id));
  }

  public suspend(): void {
    this._status = UserStatus.SUSPENDED;
    this._updatedAt = new Date();
    this.markAsModified();
  }

  public isActive(): boolean {
    return this._status === UserStatus.ACTIVE;
  }

  public isSuspended(): boolean {
    return this._status === UserStatus.SUSPENDED;
  }

  // Validation methods
  public canPlaceOrder(): boolean {
    return this._status === UserStatus.ACTIVE;
  }

  public canLogin(): boolean {
    return this._status === UserStatus.ACTIVE;
  }
}
