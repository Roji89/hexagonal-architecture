import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { OrderItemEntity } from './order-item.entity';

@Entity('orders')
export class OrderEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ name: 'customer_id' })
  customerId!: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'confirmed', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  })
  status!: string;

  // Shipping Address
  @Column({ name: 'shipping_street' })
  shippingStreet!: string;

  @Column({ name: 'shipping_city' })
  shippingCity!: string;

  @Column({ name: 'shipping_state' })
  shippingState!: string;

  @Column({ name: 'shipping_zip_code' })
  shippingZipCode!: string;

  @Column({ name: 'shipping_country' })
  shippingCountry!: string;

  // Billing Address (optional)
  @Column({ name: 'billing_street', nullable: true })
  billingStreet?: string;

  @Column({ name: 'billing_city', nullable: true })
  billingCity?: string;

  @Column({ name: 'billing_state', nullable: true })
  billingState?: string;

  @Column({ name: 'billing_zip_code', nullable: true })
  billingZipCode?: string;

  @Column({ name: 'billing_country', nullable: true })
  billingCountry?: string;

  @Column('decimal', { precision: 10, scale: 2, name: 'total_amount' })
  totalAmount!: number;

  @Column({ length: 3, default: 'USD' })
  currency!: string;

  @OneToMany(() => OrderItemEntity, item => item.order, { cascade: true })
  items!: OrderItemEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
