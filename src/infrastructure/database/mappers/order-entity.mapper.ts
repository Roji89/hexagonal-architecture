import { OrderItem } from '@domain/entities/order/order-item';
import { Order, OrderStatus } from '@domain/entities/order/order.entity';
import { Address } from '@domain/value-objects/address';
import { Money } from '@domain/value-objects/money';
import { v4 as uuidv4 } from 'uuid';
import { OrderItemEntity } from '../entities/order-item.entity';
import { OrderEntity } from '../entities/order.entity';

export class OrderEntityMapper {
  static toDomain(entity: OrderEntity): Order {
    const shippingAddress = new Address(
      entity.shippingStreet,
      entity.shippingCity,
      entity.shippingState,
      entity.shippingZipCode,
      entity.shippingCountry
    );

    const billingAddress = entity.billingStreet ? new Address(
      entity.billingStreet,
      entity.billingCity!,
      entity.billingState!,
      entity.billingZipCode!,
      entity.billingCountry!
    ) : undefined;

    const orderItems = entity.items.map(itemEntity =>
      OrderItem.create(
        itemEntity.productId,
        itemEntity.productName,
        new Money(itemEntity.unitPrice, itemEntity.currency),
        itemEntity.quantity
      )
    );

    return Order.fromPersistence(
      entity.id,
      entity.customerId,
      orderItems,
      entity.status as OrderStatus,
      shippingAddress,
      billingAddress || shippingAddress, // Use shipping as default if no billing
      undefined, // paymentId
      undefined, // trackingNumber
      undefined, // notes
      entity.createdAt,
      entity.updatedAt
    );
  }

  static toEntity(domain: Order): OrderEntity {
    const entity = new OrderEntity();
    entity.id = domain.getId();
    entity.customerId = domain.getCustomerId();
    entity.status = domain.getStatus();

    const shippingAddress = domain.getShippingAddress();
    entity.shippingStreet = shippingAddress.getStreet();
    entity.shippingCity = shippingAddress.getCity();
    entity.shippingState = shippingAddress.getState();
    entity.shippingZipCode = shippingAddress.getZipCode();
    entity.shippingCountry = shippingAddress.getCountry();

    const billingAddress = domain.getBillingAddress();
    if (billingAddress) {
      entity.billingStreet = billingAddress.getStreet();
      entity.billingCity = billingAddress.getCity();
      entity.billingState = billingAddress.getState();
      entity.billingZipCode = billingAddress.getZipCode();
      entity.billingCountry = billingAddress.getCountry();
    }

    const total = domain.calculateTotal();
    entity.totalAmount = total.getAmount();
    entity.currency = total.getCurrency();

    entity.items = domain.getItems().map(item => {
      const itemEntity = new OrderItemEntity();
      itemEntity.id = uuidv4();
      itemEntity.orderId = domain.getId();
      itemEntity.productId = item.getProductId();
      itemEntity.productName = item.getProductName();
      itemEntity.quantity = item.getQuantity();
      itemEntity.unitPrice = item.getUnitPrice().getAmount();
      itemEntity.currency = item.getUnitPrice().getCurrency();
      itemEntity.totalPrice = item.getTotalPrice().getAmount();
      return itemEntity;
    });

    entity.createdAt = domain.getCreatedAt();
    entity.updatedAt = domain.getUpdatedAt();

    return entity;
  }
}
