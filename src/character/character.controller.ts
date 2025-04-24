import { Body, Controller, Get, Param, Post, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { CharacterService } from './character.service';
import { CreateCharacterDTO } from './dtos/create-character.dto';
import { JWTAuthGuard } from 'src/account/jwt.auth.guard';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Roles } from 'src/authorization/roles.decorator';
import { RoleEnum } from 'src/account/entities/user.entity';
import { RolesGuard } from 'src/authorization/roles.guard';

@Controller('character')
@UseGuards(JWTAuthGuard, RolesGuard)
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Get()
  @Roles(RoleEnum.GAMEMASTER)
  getAllCharacters(){
    return this.characterService.getAllCharacters();
  }

  @Get(':id')
  getACharacter(@Param('id') id : string){
    return this.characterService.getACharacter(id);
  }

  @Post()
  @Roles(RoleEnum.USER)
  createCharacter(@Body() createCharacterDto : CreateCharacterDTO, @Request() req) {
    return this.characterService.createCharacter(createCharacterDto, req.user);
  }

}
