import { ForbiddenException, Injectable } from '@nestjs/common';
import { duelDTO } from './dtos/duel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Duel } from './entities/duel.entity';
import { Repository } from 'typeorm';
import { User } from 'src/account/entities/user.entity';
import { CharacterService } from 'src/character/character.service';
import { ItemService } from 'src/items/item.service';
import { GiftItemDTO } from 'src/items/dtos/gift-item.dto';

@Injectable()
export class CombatService {

    constructor(
        @InjectRepository(Duel)
        private readonly duelRepository : Repository<Duel>,
        private readonly characterSevice : CharacterService,
        private readonly itemService : ItemService
    ){}

    async initiateCombat(duelDto : duelDTO){
        const challenger = await this.characterSevice.findOne(duelDto.challengerId);
        const challenged = await this.characterSevice.findOne(duelDto.challengedId);
        duelDto.duelStart = new Date();
        const duel = this.duelRepository.create(duelDto);
        duel.challengedHealth = challenged.health;
        duel.challengerHealth = challenger.health;
        duel.turn = 0;
        duel.challenged = challenged;
        duel.challenger = challenger;

        return this.duelRepository.save(duel);
    }

    async attack(duelId : number, initiator : User){
        const duel = await this.findOne(duelId);

        if(Date.now() - duel.duelStart.getTime() > 300 * 1000){
            throw new ForbiddenException("Duel is over");
        }

        const challenger = await this.characterSevice.getACharacter(duel.challenger.id.toString());
        const challenged = await this.characterSevice.getACharacter(duel.challenged.id.toString());
        const initiator_id = (initiator as any)['userId']        

        if(duel.challenged.createdBy.id === initiator_id && duel.turn === 1){
            if(duel.lastAttackChallenged && Date.now() - duel.lastAttackChallenged.getTime() < 1000){
                throw new ForbiddenException("You cannot attack right now");
            }
            duel.challengerHealth -= challenged.totalStrength + challenged.totalAgility;
            if(duel.challengerHealth <= 0){
                let giftItemDto : GiftItemDTO = {
                    assignFrom : duel.challenger.id,
                    assignTo : duel.challenged.id

                }
                this.itemService.giftItem(giftItemDto)
                return "Duel is over, character " + duel.challenged.name + " won";
            }
            duel.lastAttackChallenged = new Date();
            duel.turn = 0
        }

        else if(duel.challenger.createdBy.id === initiator_id && duel.turn === 0){
            if(duel.lastAttackChallenger && Date.now() - duel.lastAttackChallenger.getTime() < 1000){
                throw new ForbiddenException("You cannot attack right now");
            }
            duel.challengedHealth -= challenger.totalStrength + challenger.totalAgility;
            if(duel.challengedHealth <= 0){
                let giftItemDto : GiftItemDTO = {
                    assignFrom : duel.challenged.id,
                    assignTo : duel.challenger.id
                }
                this.itemService.giftItem(giftItemDto)
                return "Duel is over, character " + duel.challenger.name + " won"
            }
            duel.lastAttackChallenger = new Date();
            duel.turn = 1
        }
        else{
            throw new ForbiddenException("It is not your turn");
        }
        return this.duelRepository.save(duel);
    }

    async cast(duelId : number, initiator : User){
        const duel = await this.findOne(duelId);
        if(Date.now() - duel.duelStart.getTime() > 300 * 1000){
            throw new ForbiddenException("Duel is over");
        }

        const challenger = await this.characterSevice.getACharacter(duel.challenger.id.toString());
        const challenged = await this.characterSevice.getACharacter(duel.challenged.id.toString());
        const initiator_id = (initiator as any)['userId']

        if(duel.challenged.createdBy.id === initiator_id && duel.turn === 1){
            if(duel.lastCastChallenged && Date.now() - duel.lastCastChallenged.getTime() < 2000){
                throw new ForbiddenException("You cannot cast right now");
            }
            duel.challengerHealth -= challenged.totalIntelligence * 2;
            if(duel.challengerHealth <= 0){
                let giftItemDto : GiftItemDTO = {
                    assignFrom : duel.challenger.id,
                    assignTo : duel.challenged.id
                }
                this.itemService.giftItem(giftItemDto);
                return "Duel is over, character " + duel.challenged.name + " won";
            }
            duel.lastCastChallenged = new Date();
            duel.turn = 0
        }

        else if(duel.challenger.createdBy.id === initiator_id && duel.turn === 0){
            if(duel.lastCastChallenger && Date.now() - duel.lastCastChallenger.getTime() < 2000){
                throw new ForbiddenException("You cannot cast right now");
            }
            duel.challengedHealth -= challenger.totalIntelligence * 2;
            if(duel.challengedHealth <= 0){
                let giftItemDto : GiftItemDTO = {
                    assignFrom : duel.challenged.id,
                    assignTo : duel.challenger.id
                }
                this.itemService.giftItem(giftItemDto)
                return "Duel is over, character " + duel.challenger.name + " won"
            }
            duel.lastCastChallenger = new Date();
            duel.turn = 1
        }
        else{
            throw new ForbiddenException("It is not your turn");
        }
        return this.duelRepository.save(duel);
    }

    async heal(duelId : number, initiator : User){
        const duel = await this.findOne(duelId);
        if(Date.now() - duel.duelStart.getTime() > 300 * 1000){
            throw new ForbiddenException("Duel is over");
        }

        const challenger = await this.characterSevice.getACharacter(duel.challenger.id.toString());
        const challenged = await this.characterSevice.getACharacter(duel.challenged.id.toString());
        const initiator_id = (initiator as any)['userId']

        if(duel.challenged.createdBy.id === initiator_id && duel.turn === 1){
            if(duel.lastHealChallenged && Date.now() - duel.lastHealChallenged.getTime() < 2000){
                throw new ForbiddenException("You cannot heal right now");
            }
            duel.challengedHealth += challenged.totalFaith;
            duel.lastHealChallenged = new Date();
            duel.turn = 0
        }

        else if(duel.challenger.createdBy.id === initiator_id && duel.turn === 0){
            if(duel.lastHealChallenger && Date.now() - duel.lastHealChallenger.getTime() < 2000){
                throw new ForbiddenException("You cannot heal right now");
            }
            duel.challengerHealth += challenger.totalFaith;
            duel.lastHealChallenger = new Date();
            duel.turn = 1
        }
        else{
            throw new ForbiddenException("It is not your turn");
        }
        return this.duelRepository.save(duel);
    }

    findOne(id : number){
        return this.duelRepository.findOne({
            where:{duelId : id},
            relations : ['challenger', 'challenger.createdBy', 'challenged', 'challenged.createdBy']
        });
    }
}
