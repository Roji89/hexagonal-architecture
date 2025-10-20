import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { OrderEntity } from './order.entity';

@Entity('order_items')
export class OrderItemEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ name: 'order_id' })
  orderId!: string;

  @Column({ name: 'product_id' })
  productId!: string;

  @Column({ name: 'product_name' })
  productName!: string;

  @Column()
  quantity!: number;

  @Column('decimal', { precision: 10, scale: 2, name: 'unit_price' })
  unitPrice!: number;

  @Column({ length: 3, default: 'USD' })
  currency!: string;

  @Column('decimal', { precision: 10, scale: 2, name: 'total_price' })
  totalPrice!: number;

  @ManyToOne(() => OrderEntity, order => order.items)
  @JoinColumn({ name: 'order_id' })
  order!: OrderEntity;
}
