import { Body, Controller, Get, Param, ParseUUIDPipe, Post, UploadedFile, UseGuards, UseInterceptors, Request } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { ProductPostDto } from './dto/product-post.dto';
import { ProductService } from './product.service';

import { storage } from './multer.storage';




@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Post("/")
    @UseGuards(JwtAuthGuard) //para poder crear productos hay que hacer login y despues enviar access_token en las cabeceras
    @UseInterceptors(FileInterceptor("myImg", { dest: "./src/img", storage: storage }))
    createProduct(@Body() data: ProductPostDto, @Request() req, @UploadedFile() file: Express.Multer.File) {
        const price = parseInt(data.price)
        const myObj = { ...data, price: price }
        return this.productService.createProduct(myObj, file.path, req.user.id)
    }


    @Post(":productId")
    @UseGuards(JwtAuthGuard) //send token in the headers
    buyProduct(@Param("productId", ParseUUIDPipe) id: string, @Request() req) {
        const buyerId = req.user.id;
        return this.productService.buyProduct(id, buyerId)
    }

    @Get("/")
    getProducts() {
        return this.productService.getProducts()
    }


    @Get(":id")
    getProduct(@Param("id", ParseUUIDPipe) id: string) {
        return this.productService.getProductInfo(id)
    }
}
