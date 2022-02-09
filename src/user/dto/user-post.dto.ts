import { IsString } from "class-validator";


export class UserPostDto {

    @IsString()
    name: string;

    @IsString()
    username: string;

    @IsString()
    password: string;
}