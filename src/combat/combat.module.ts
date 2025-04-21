import { Module } from '@nestjs/common';
import { CombatService } from './combat.service';
import { CombatController } from './combat.controller';
import { CharacterModule } from 'src/character/character.module';
import { ItemModule } from 'src/items/item.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Duel } from './entities/duel.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Duel]), CharacterModule, ItemModule],
  controllers: [CombatController],
  providers: [CombatService],
})
export class CombatModule {}
