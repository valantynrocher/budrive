import { Controller, Get } from "@nestjs/common";
import { UsersService } from "../application/users.service";

@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getAllUsers() {
    return this.usersService.findAll();
  }
}
