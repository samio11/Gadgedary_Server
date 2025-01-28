import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getProductsByCategory(
    @Query('category') category?: string, // Optional query parameter for category
  ): Promise<Product[]> {
    if (category) {
      return this.productsService.getProductsByCategory(category);
    }
    return this.productsService.findAll(); // If no category is provided, return all products
  }

  @Post('/create-product')
  async createProduct(@Body() productData: Partial<Product>): Promise<Product> {
    return this.productsService.create(productData);
  }

  @Get('/paginated')
  async getPaginatedProducts(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '6',
  ): Promise<{ data: Product[]; total: number }> {
    const pageNumber = parseInt(page, 10) || 1;
    const pageLimit = parseInt(limit, 10) || 6;
    return this.productsService.getPaginatedProducts(pageNumber, pageLimit);
  }

  @Get('/categories')
  async getCategories(): Promise<string[]> {
    return this.productsService.getCategories();
  }

  @Get('/filter-by-budget')
  async getProductsByBudget(
    @Query('min_budget') minBudget?: string,
    @Query('max_budget') maxBudget?: string,
  ): Promise<Product[]> {
    const min = parseFloat(minBudget) || 0; // Default to 0 if min_budget is not provided
    const max = parseFloat(maxBudget) || Number.MAX_SAFE_INTEGER; // Default to maximum value if max_budget is not provided
    return this.productsService.getProductsByBudget(min, max);
  }

  @Get('/top-offers')
  async getTopOffers(): Promise<Product[]> {
    return this.productsService.getTopOffers();
  }
}
