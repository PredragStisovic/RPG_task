import { Module } from '@nestjs/common';
import { CharacterService } from './character.service';
import { CharacterController } from './character.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Character } from './entities/character.entity';
import { Class } from './entities/class.entity';
import { User } from 'src/account/entities/user.entity';
import { CharacterItem } from 'src/items/entities/character-item.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Character, Class, User, CharacterItem])],
  controllers: [CharacterController],
  providers: [CharacterService],
  exports : [CharacterService]
})
export class CharacterModule {}
