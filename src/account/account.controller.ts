import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { LocalAuthGuard } from './local-auth.guard';
import { CreateUserDto } from './dtos/CreateUser.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req){
    return this.accountService.login(req.user);
  }

  @Post('register')
  async register(@Body() registerBody : CreateUserDto){
    return await this.accountService.register(registerBody);
  }
  
}
