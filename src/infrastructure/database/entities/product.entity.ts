import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn, VersionColumn } from 'typeorm';

@Entity('products')
export class ProductEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @VersionColumn()
  version!: number;

  @Column()
  name!: string;

  @Column('text')
  description!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price!: number;

  @Column({ length: 3, default: 'USD' })
  currency!: string;

  @Column({ name: 'stock_quantity', default: 0 })
  stockQuantity!: number;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive', 'out_of_stock', 'discontinued'],
    default: 'active'
  })
  status!: string;

  @Column({ unique: true })
  sku!: string;

  @Column()
  category!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
