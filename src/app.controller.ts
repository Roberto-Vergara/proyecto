import { Controller, Get, Post, UseGuards } from "@nestjs/common";
import { LocalAuthGuard } from "./auth/local/local-auth.guard";
import { Request } from "@nestjs/common";
import { AuthService } from "./auth/auth.service";
import { JwtAuthGuard } from "./auth/jwt/jwt-auth.guard";



@Controller("/")
export class AppController {

    constructor(private authService: AuthService) { }


    @Post("/login")
    @UseGuards(LocalAuthGuard)//esta parte es como el authenticate("local") de node normal, con notacion Bearer token
    login(@Request() req) {
        return this.authService.login(req.user);
    }

    @Get("/test")
    @UseGuards(JwtAuthGuard)
    test(@Request() req) {
        return (req.user);

    }
}