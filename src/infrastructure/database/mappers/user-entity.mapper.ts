import { User, UserStatus } from '@domain/entities/user/user.entity';
import { Address } from '@domain/value-objects/address';
import { UserEntity } from '../entities/user.entity';

export class UserEntityMapper {
  static toDomain(entity: UserEntity): User {
    const address = entity.addressStreet ? new Address(
      entity.addressStreet,
      entity.addressCity!,
      entity.addressState!,
      entity.addressZipCode!,
      entity.addressCountry!
    ) : undefined;

    return User.fromPersistence(
      entity.id,
      entity.email,
      entity.firstName,
      entity.lastName,
      entity.passwordHash,
      entity.status as UserStatus,
      address,
      entity.createdAt,
      entity.updatedAt
    );
  }

  static toEntity(domain: User): UserEntity {
    const entity = new UserEntity();
    entity.id = domain.getId();
    entity.email = domain.getEmail().getValue();
    entity.firstName = domain.getFirstName();
    entity.lastName = domain.getLastName();
    entity.passwordHash = domain.getPasswordHash();
    entity.status = domain.getStatus();

    const address = domain.getAddress();
    if (address) {
      entity.addressStreet = address.getStreet();
      entity.addressCity = address.getCity();
      entity.addressState = address.getState();
      entity.addressZipCode = address.getZipCode();
      entity.addressCountry = address.getCountry();
    }

    entity.createdAt = domain.getCreatedAt();
    entity.updatedAt = domain.getUpdatedAt();

    return entity;
  }
}
