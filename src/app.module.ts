import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    UserModule,
    ProductModule,
    CloudinaryModule,
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule
  ],
  controllers: [AppController]
})
export class AppModule { }
