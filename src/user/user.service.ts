import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPostDto } from './dto/user-post.dto';
import { User } from './schema/user.entity';

import { v4 } from 'uuid';
import * as bcrypt from "bcrypt"

@Injectable()
export class UserService {

    constructor(@InjectRepository(User) private userRepository: Repository<User>) { }

    async createUser(data: UserPostDto) {
        try {

            const uuid = v4();
            const hashPass = await bcrypt.hash(data.password, 8)
            const createdUser = this.userRepository.create({ ...data, id: uuid, password: hashPass, money: 10000 });
            if (!createdUser) {
                throw { ok: false, message: "error in create user", status: 400 }
            }
            await createdUser.save();

            return { ok: true, message: "user created", status: 201 }
        } catch (error) {
            if (!error.ok) {
                throw new HttpException(error, error.status)
            }
            throw new HttpException(error, 400)
        }
    }

    async getUsers() {
        const users = await this.userRepository.find();
        return users;
    }

    async getUser(id: string) {
        try {
            const user = await this.userRepository.findOne({ relations: ["products"], where: { id: id } });
            const { password, ...rest } = user;
            return { user: rest };
        } catch (error) {
            console.log(error);

        }
    }


    async delUser(id: string) {
        try {
            const delUser = await this.userRepository.delete(id);

            return { ok: true, messge: "usuario eliminado", status: 200 }
        } catch (error) {

        }
    }

    async findUser(username: string) {
        try {
            const user = await this.userRepository.findOne({ where: { username: username } });
            if (!user) {
                throw "usuario inexistente"
            }
            return user;
        } catch (error) {
            throw null
        }
    }
}
