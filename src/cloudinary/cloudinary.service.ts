import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { cloudinaryInject } from "./cloudinary.custom";

@Injectable()
export class CloudinarySevice {

    v2: any;
    constructor(@Inject(cloudinaryInject) private cloudinary, private configService: ConfigService) {
        this.cloudinary.v2.config({
            cloud_name: this.configService.get("CLOUD_NAME"),
            api_key: this.configService.get("API_KEY"),
            api_secret: this.configService.get("API_SECRET")
        })
        this.v2 = cloudinary.v2;
    }

    async uploadFile(filePath: string) {
        const data = await this.v2.uploader.upload(filePath)
        return data;
    }
}