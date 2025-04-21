import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { Character } from 'src/character/entities/character.entity';
import { CharacterItem } from './entities/character-item.entity';
import { CharacterModule } from 'src/character/character.module';

@Module({
  imports : [TypeOrmModule.forFeature([Item, Character,CharacterItem]), CharacterModule],
  controllers: [ItemController],
  providers: [ItemService],
  exports : [ItemService]
})
export class ItemModule {}
