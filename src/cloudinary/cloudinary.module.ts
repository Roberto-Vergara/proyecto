import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CloudinaryCustom } from './cloudinary.custom';
import { CloudinarySevice } from './cloudinary.service';

@Module({
    providers: [CloudinaryCustom, CloudinarySevice, ConfigService],
    exports: [CloudinaryCustom, CloudinarySevice]
})
export class CloudinaryModule { }
