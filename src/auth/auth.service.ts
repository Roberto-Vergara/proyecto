import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

import * as bcrypt from "bcrypt"
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(private userService: UserService, private jwtService: JwtService) {
    }

    async validateUser(username: string, password: string) {
        try {
            const userInfo = await this.userService.findUser(username);
            if (!userInfo) {
                throw "usuario no encontrado"
            }
            const hashPass = userInfo.password;
            const compare = await bcrypt.compare(password, hashPass)
            if (!compare) {
                throw "contraseña incorrecta"
            }
            const { name, id } = userInfo
            return { name, id, username: userInfo.username };
        } catch (error) {
            console.log(error);
            throw null
        }

    }


    async login(reqUser: any) {
        const { username, name, id } = reqUser;
        const payload = { username, name, id }
        const accessToken = this.jwtService.sign(payload)
        return { accessToken };
    }
}
