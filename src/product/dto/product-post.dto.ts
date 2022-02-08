import { IsString, IsNumber } from "class-validator";

export class ProductPostDto {

    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsString()
    price: string;
}