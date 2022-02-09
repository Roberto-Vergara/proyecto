import { Inject, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport"
import { Strategy } from "passport-local"
import { AuthService } from "../auth.service"

export class LocalStrategy extends PassportStrategy(Strategy) {

    constructor(@Inject(AuthService) private authService: AuthService) {
        super()
    }

    // creao que si o si hay que poner validate como nombre de funcion, por obligacion de nest
    async validate(username: string, password: string) {
        try {
            const user = await this.authService.validateUser(username, password);
            if (!user) {
                console.log("usuario no autorizado");

                throw new UnauthorizedException();
            }
            // this user will be atach to the req property
            return user;
        } catch (error) {
            console.log(error);
            throw new UnauthorizedException();
        }
    }
}