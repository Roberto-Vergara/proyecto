import { PassportStrategy } from "@nestjs/passport"
import { Strategy, ExtractJwt } from "passport-jwt";


export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: "mysecret",
            ignoreExpiration: false
        })
    }


    validate(resPayload: any) {
        const { username, name, id } = resPayload;
        return { username, name, id }
    }
}