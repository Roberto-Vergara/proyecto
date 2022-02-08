import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { UserPostDto } from './dto/user-post.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }


    @Get("/")
    getUsers() {
        return this.userService.getUsers();
    }


    @Post("/")
    createUser(@Body() data: UserPostDto) {
        return this.userService.createUser(data)
    }

    @Get(":userId")
    getUser(@Param("userId", ParseUUIDPipe) id: string) {
        return this.userService.getUser(id)
    }

    @Delete(":userId")
    delUser(@Param("userId", ParseUUIDPipe) id: string) {
        return this.userService.delUser(id)
    }
}
