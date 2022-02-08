import { Controller, Post, UseGuards } from "@nestjs/common";
import { LocalAuthGuard } from "./auth/local/local-auth.guard";
import { Request } from "@nestjs/common";
import { AuthService } from "./auth/auth.service";



@Controller("")
export class AppController {

    constructor(private authService: AuthService) { }


    @Post("/login")
    @UseGuards(LocalAuthGuard)//esta parte es como el authenticate("local") de node normal, con notacion Bearer token
    login(@Request() req) {
        return this.authService.login(req.user);
    }
}