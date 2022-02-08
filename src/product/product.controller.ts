import { Body, Controller, Param, ParseUUIDPipe, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { ProductPostDto } from './dto/product-post.dto';
import { ProductService } from './product.service';

import { Request } from '@nestjs/common';


const storage = multer.diskStorage({
    destination: "./src/img",
    filename: (req, file, cb) => { cb(null, `${file.fieldname}${Date.now()}.${file.mimetype.split("/")[1]}`) }
})

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Post(":creatorId")
    @UseInterceptors(FileInterceptor("myImg", { dest: "./src/img", storage: storage }))
    createProduct(@Body() data: ProductPostDto, @Param("creatorId", ParseUUIDPipe) id: string, @UploadedFile() file: Express.Multer.File) {
        const price = parseInt(data.price)
        const myObj = { ...data, price: price }
        return this.productService.createProduct(myObj, file.path, id)
    }


    @Post(":productId")
    @UseGuards(JwtAuthGuard) //send token in headers
    buyProduct(@Param("productId", ParseUUIDPipe) id: string, @Request() req) {
        const userId = req.user.id;
        return this.productService.buyProduct(id, userId)
    }
}
