import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('cart')
export class Cart {
  @PrimaryGeneratedColumn()
  id: number; // Unique cart ID

  @Column()
  customer_email: string; // Customer Email

  // Full details of product
  @Column()
  product_id: number; // Product ID

  @Column()
  name: string; // Product Name

  @Column()
  category: string;

  @Column()
  brand: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 3, scale: 1 }) // Changed to decimal
  rating: number; // Rating can be decimal (e.g., 4.8)

  @Column('text')
  product_image: string;

  @Column()
  warranty: boolean;

  @Column()
  product_added_date: string;

  @Column()
  offer_available: boolean;

  @Column()
  quantity: number; // Quantity in cart

  @Column({
    type: 'enum',
    enum: ['Pending', 'Payed'],
    default: 'Pending', // Default payment status
  })
  payment_status: 'Pending' | 'Payed'; // Payment Status
}
