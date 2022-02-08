import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from "@nestjs/typeorm"
import { Product } from 'src/product/schema/product.entity';
import { User } from 'src/user/schema/user.entity';

@Module({
    imports: [TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
            type: "mysql",
            host: configService.get<string>("HOST"),
            port: configService.get<number>("PORT"),
            username: configService.get<string>("USER_NAME"),
            database: configService.get("DATABASE"),
            password: configService.get("PASSWORD"),
            entities: [User, Product],
            synchronize: true

        }),
        inject: [ConfigService]
    })]
})
export class DatabaseModule { }
