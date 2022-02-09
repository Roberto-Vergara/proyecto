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


    async getProduct(productId): Promise<Product> {
        try {
            const product = await this.productRespository.findOne(productId, { relations: ["user"] });
            if (!product) {
                throw { ok: false, message: "product not found", status: 404 }
            }
            return product;
        } catch (error) {
            return error;
        }
    }

    async deposit(money: number, toId: string, user: User) {
        try {

            // another user
            const receiver = await this.userRepository.findOne(toId, { relations: ["products"] });
            user.money = user.money - money;
            receiver.money = receiver.money + money;

            return { user, receiver }

        } catch (error) {
            return error;
        }
    }

    async tradeProduct(producto: Product, seller: User, buyer: User) {
        try {
            const findProduct = await this.productRespository.findOne(producto.id)
            const findUser = await this.userRepository.findOne(buyer.id)

            producto.user = findUser;
            buyer.products = [...buyer.products, findProduct]
            seller.products = [...seller.products.filter((e) => e.id !== findProduct.id)]

            return { producto, seller, buyer }


        } catch (error) {
            return error;
        }
    }



    async buyProduct(productId: string, userId: string) {
        try {
            const product = await this.getProduct(productId);
            const meUser = await this.userRepository.findOne(userId, { relations: ["products"] })
            if (!meUser) throw "usuario no encontrado token malo";

            if (meUser.money >= product.price) {
                // user deposit money to receiver and receiver(seller) give his item to user(buyer)
                const { user, receiver } = await this.deposit(product.price, product.user.id, meUser);
                // console.log(user, receiver); bien hasta aqui

                const { producto, buyer, seller } = await this.tradeProduct(product, receiver, user);
                console.log(buyer, seller, producto);

                await buyer.save()
                await seller.save()
                await producto.save()
            }
            else throw { ok: false, message: "no puede comprarlo" }

            return { ok: true, message: "producto comprado" }

        } catch (error) {
            console.log(error);
        }

    }




    async getProducts() {
        return this.productRespository.find();
    }


    async getProductInfo(id: string) {
        try {
            const product = await this.productRespository.findOne(id, { relations: ["user"] })
            if (!product) {
                throw { ok: false, message: "product not found", status: 404 }
            }
            const user_id = product.user.id;
            const { user, ...rest } = product;
            const myRes = { ...rest, user_id }

            return myRes;
        } catch (error) {
            console.log(error);

        }
    }
}
