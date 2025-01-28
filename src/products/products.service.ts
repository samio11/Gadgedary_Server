import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // Fetch all products
  findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  // Fetch products by category
  async getProductsByCategory(category: string): Promise<Product[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .where('product.category = :category', { category })
      .orderBy('product.rating', 'DESC') // Order by rating for better user experience
      .getMany();
  }

  // Create a new product
  create(product: Partial<Product>): Promise<Product> {
    const newProduct = this.productRepository.create(product);
    return this.productRepository.save(newProduct);
  }

  // Get paginated products
  async getPaginatedProducts(
    page: number = 1,
    limit: number = 6,
  ): Promise<{ data: Product[]; total: number }> {
    const pageNumber = page > 0 ? page : 1;
    const pageLimit = limit > 0 ? limit : 6;

    const [data, total] = await this.productRepository.findAndCount({
      skip: (pageNumber - 1) * pageLimit,
      take: pageLimit,
      order: { rating: 'DESC' },
    });

    return { data, total };
  }

  // Get unique categories
  async getCategories(): Promise<string[]> {
    const categories = await this.productRepository
      .createQueryBuilder('product')
      .select('DISTINCT product.category', 'category')
      .getRawMany();

    return categories.map((item) => item.category);
  }

  // Fetch products within a specific budget range
  async getProductsByBudget(
    minBudget: number,
    maxBudget: number,
  ): Promise<Product[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .where('product.price >= :minBudget AND product.price <= :maxBudget', {
        minBudget,
        maxBudget,
      })
      .orderBy('product.price', 'ASC') // Optional: Sort by price (ascending)
      .getMany();
  }

  // Get top offers
  async getTopOffers(): Promise<Product[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .where('product.offer_available = :offerAvailable', {
        offerAvailable: true,
      })
      .orderBy('product.rating', 'DESC')
      .limit(3)
      .getMany();
  }
}
