import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('payment')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customer_email: string; // Must match Cart entity's email

  @Column()
  product_name: string; // Name of the purchased product

  @Column('decimal', { precision: 10, scale: 2 })
  price: number; // Final paid price

  @Column()
  transaction_id: string; // Stripe Transaction ID

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  payment_date: Date;

  @Column({
    type: 'enum',
    enum: ['Pending', 'Paid'],
    default: 'Pending',
  })
  payment_status: 'Pending' | 'Paid'; // Payment Status
}
