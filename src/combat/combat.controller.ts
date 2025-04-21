import { Body, Controller, ForbiddenException, Param, Post, Request, UseGuards } from '@nestjs/common';
import { CombatService } from './combat.service';
import { duelDTO } from './dtos/duel.dto';
import { JWTAuthGuard } from 'src/account/jwt.auth.guard';
import { ParticipantGuard } from 'src/authorization/participant.guard';

@Controller()
@UseGuards(JWTAuthGuard)
export class CombatController {
  constructor(private readonly combatService: CombatService) {}
  
  @Post('challenge')
  initiateCombat(@Body() duelDto : duelDTO, @Request() req){
    return this.combatService.initiateCombat(duelDto);
  }

  @Post(':duel_id/attack')
  @UseGuards(ParticipantGuard)
  attack(@Param('duel_id') duelId : string, @Request() req){
    return this.combatService.attack(+duelId, req.user);
  }

  @Post(':duel_id/cast')
  @UseGuards(ParticipantGuard)
  cast(@Param('duel_id') duelId : string, @Request() req){
    return this.combatService.cast(+duelId, req.user);
  }

  @Post(':duel_id/heal')
  @UseGuards(ParticipantGuard)
  heal(@Param('duel_id') duelId : string, @Request() req){
    return this.combatService.heal(+duelId, req.user);
  }

}
