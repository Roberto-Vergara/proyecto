import { UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport"
import { Strategy } from "passport-local"
import { AuthService } from "../auth.service"

export class LocalStrategy extends PassportStrategy(Strategy) {

    constructor(private authService: AuthService) {
        super({

        })
    }

    async validateUser(username, password) {
        try {
            const user = this.authService.validateUser(username, password);
            if (!user) {
                throw new UnauthorizedException();
            }
            // this user will be atach to the req property
            return user;
        } catch (error) {
            throw new UnauthorizedException();
        }
    }
}