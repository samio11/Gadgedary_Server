import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies.token; // Ensure this matches the cookie key used in CustomerController

    if (!token) {
      throw new UnauthorizedException('Unauthorized: No token provided');
    }

    try {
      const decoded = this.jwtService.verify(token);
      request.user = decoded; // Attach decoded data to request
      return true;
    } catch (err) {
      throw new UnauthorizedException('Unauthorized: Invalid token');
    }
  }
}
