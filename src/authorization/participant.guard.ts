import { CanActivate, ExecutionContext, Injectable, NotFoundException } from "@nestjs/common";
import { Observable } from "rxjs";
import { CombatService } from "src/combat/combat.service";

@Injectable()
export class ParticipantGuard implements CanActivate{
    constructor(
        private readonly combatService : CombatService
    ){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest()
        const userId = req.user.userId;
        const duelId = req.params.duel_id;

        const duel = await this.combatService.findOne(duelId);
        if(!duel){
            throw new NotFoundException("Duel with this ID does not exist");
        }

        return (duel.challenged.createdBy.id === userId || duel.challenger.createdBy.id === userId); 
    }
}
