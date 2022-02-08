import { IsString } from "class-validator";


export class UserPostDto {

    @IsString()
    name: string;

    @IsString()
    usename: string;

    @IsString()
    password: string;
}