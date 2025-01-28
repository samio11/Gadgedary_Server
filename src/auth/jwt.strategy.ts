import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';
import { CustomerService } from '../customer/customer.service'; // Injecting CustomerService for user validation

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly jwtService: JwtService,
    private readonly customerService: CustomerService, // Inject CustomerService to validate user
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req.cookies?.token, // Extract token from cookies
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET, // JWT secret key for verification
    });
  }

  async validate(payload: any) {
    // Optionally, you can use this to check user from the database
    return { userId: payload.sub, email: payload.email };
  }
}
