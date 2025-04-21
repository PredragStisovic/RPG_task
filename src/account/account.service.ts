import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dtos/CreateUser.dto';
const bcrypt = require('bcrypt');

@Injectable()
export class AccountService {
        constructor(
            @InjectRepository(User)
            private readonly userRepository : Repository<User>,
            private readonly jwtService : JwtService
        ){}

        async validateUser(param_username : string, password : string) : Promise<User>{
            const user = await this.userRepository.findOneBy({ username : param_username})
            if(!user){
                throw new NotFoundException("User not found")
            }
            if(!bcrypt.compareSync(password, user.password)){
                throw new BadRequestException("Password does not match")
            }
            return user;
        }
        async login(user : User){
            const payload = {username : user.username, sub : user.id, role : user.role}
            return {access_token : this.jwtService.sign(payload)}
        }
        async register(user : CreateUserDto){
            const existing = await this.userRepository.findOneBy({ username : user.username});
            if(existing){
                throw new BadRequestException("User already exists")
            } 
            const hashedPassword = await bcrypt.hash(user.password,10);
            user.password = hashedPassword;
            return this.login(await this.userRepository.save(user));
        }

}
