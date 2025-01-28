import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('customer')
export class Customer {
  @PrimaryGeneratedColumn()
  id: number; // Unique customer ID

  @Column()
  name: string; // Customer's name

  @Column()
  email: string; // Customer's email (used for login)

  @Column()
  password: string; // Customer's password (hashed)

  @Column({ nullable: true })
  image: string; // Customer's profile image (if provided)
}
