import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column()
  brand: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  stock: number;

  @Column('decimal', { precision: 3, scale: 1 })
  rating: number;

  @Column('json', { nullable: true })
  description: {
    model: string;
    IP: string;
    camera: string;
    chipset: string;
    ram: string;
    storage: string;
    color: string;
  };

  @Column({ nullable: false })
  product_image: string;

  @Column({ type: 'boolean', default: false })
  warranty: boolean; // Warranty column as boolean

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  product_added_date: string; // Date in YYYY-MM-DD format

  @Column({ type: 'boolean', default: false })
  offer_available: boolean;
}
