import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewDTO } from './review.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('reviews')
@UseGuards(AuthGuard) // Apply auth guard
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  // Route for submitting a review@UseGuards(AuthGuard) // Apply auth guard
  @Post()
  async addReview(@Body() reviewDTO: ReviewDTO) {
    return this.reviewService.addReview(reviewDTO);
  }

  // Route for getting reviews of a product
  @Get(':productId')
  async getProductReviews(@Param('productId') productId: number) {
    return this.reviewService.getProductReviews(productId);
  }
}
