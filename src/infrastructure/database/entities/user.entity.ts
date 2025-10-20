import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ name: 'first_name' })
  firstName!: string;

  @Column({ name: 'last_name' })
  lastName!: string;

  @Column({ name: 'password_hash' })
  passwordHash!: string;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  })
  status!: string;

  // Address as embedded columns
  @Column({ name: 'address_street', nullable: true })
  addressStreet?: string;

  @Column({ name: 'address_city', nullable: true })
  addressCity?: string;

  @Column({ name: 'address_state', nullable: true })
  addressState?: string;

  @Column({ name: 'address_zip_code', nullable: true })
  addressZipCode?: string;

  @Column({ name: 'address_country', nullable: true })
  addressCountry?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
