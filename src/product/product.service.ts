import { HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinarySevice } from 'src/cloudinary/cloudinary.service';
import { User } from 'src/user/schema/user.entity';
import { Repository } from 'typeorm';
import { Product } from './schema/product.entity';

import { v4 } from 'uuid';
import * as fs from "fs"

@Injectable()
export class ProductService {
    constructor(@Inject(CloudinarySevice) private clodinaryService: CloudinarySevice,
        @InjectRepository(Product) private productRespository: Repository<Product>,
        @InjectRepository(User) private userRepository: Repository<User>) { }

    async createProduct(data: { price: number, name: string, description: string }, path: string, id: string) {
        try {
            const findUser = await this.userRepository.findOne(id);
            if (!findUser) {
                throw { ok: false, message: "user not found", status: 404 }
            }
            const resCloud = await this.clodinaryService.uploadFile(path);
            const genId = v4()
            const createdProduct = this.productRespository.create({ ...data, imageUrl: resCloud.secure_url, user: findUser, id: genId })
            if (!createdProduct) {
                throw { ok: false, message: "create product error", status: 404 }
            }
            await createdProduct.save()
            fs.rm(path, (err) => {
                if (err) {
                    console.log("error al borrar archivo");
                }
                console.log("archivo borrado");

            })
            return { ok: true, message: "product created", status: 201 }
        } catch (error) {
            if (!error.ok) {
                throw new HttpException(error, error.status)
            }
            throw new HttpException(error, 400)
        }

    }

    async buyProduct(id: string, userId: string) {
        try {
            const findBuyer = await this.userRepository.findOne(userId, { relations: ["products"] });
            const { money } = findBuyer;
            const findProduct = await this.productRespository.findOne(id);
            if (!findProduct) {
                throw { ok: false, message: "product not found aa", status: 404 }
            }
            const { price, user } = findProduct;
            if (price <= money) {
                findBuyer.money = findBuyer.money - price;
                findBuyer.products.push(findProduct)
                user.money = user.money + price;
                const updateProducts = user.products.filter((data) => data != findProduct)
                user.products = [...updateProducts]
                await findBuyer.save()
                await user.save()

                return { ok: true, message: "producto comprado" }
            } else {
                throw "no se pudo comprar el producto"

            }
        } catch (error) {
            console.log(error);
        }
    }
}
