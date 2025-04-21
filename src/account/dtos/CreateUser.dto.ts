import { RoleEnum } from "../entities/user.entity";

export class CreateUserDto{
    username : string;
    password : string;
    role : RoleEnum;
}