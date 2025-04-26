import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({
    secret: 'secretKey', // Use a strong secret key in production
    signOptions: { expiresIn: '2h', algorithm: 'HS256' }, // Token expiration time
  })],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
