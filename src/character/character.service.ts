import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Character } from './entities/character.entity';
import { Repository } from 'typeorm';
import { CreateCharacterDTO } from './dtos/create-character.dto';
import { User } from '../account/entities/user.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { totalStatsDTO } from './dtos/total-stats.dto';
import { Class } from './entities/class.entity';
import { CharacterItem } from '../items/entities/character-item.entity';

@Injectable()
export class CharacterService {
    constructor(
        @InjectRepository(Character)
        private readonly characterRepository : Repository<Character>,
        @Inject(CACHE_MANAGER)
        private cacheManager : Cache,
        @InjectRepository(Class)
        private readonly classRepository : Repository<Class>,
        @InjectRepository(User)
        private readonly userRepository : Repository<User>,
        @InjectRepository(CharacterItem)
        private readonly characterItemRepository : Repository<CharacterItem>
    ){}
    getAllCharacters(){
        return this.characterRepository.createQueryBuilder("user")
        .select(["user.name","user.health","user.mana"])
        .getRawMany();
    }

    async getACharacter(id : string){
        let character = await this.cacheManager.get<Character>(id);
        let character_items = await this.cacheManager.get<CharacterItem[]>("items:"+id);

        if(!character){
            character = await this.characterRepository.findOneBy({id : +id});
            this.cacheManager.set(id, character, 300);
        }
        if(!character_items){
            character_items = await this.characterItemRepository.find({
                where : {characterId : +id},
                relations : ['item'] 
            })
        }
        const totalStatsDto : totalStatsDTO ={
            name : character.name,
            health : character.health,
            mana : character.mana,
            totalStrength : character.baseStrength,
            totalAgility : character.baseAgility,
            totalFaith : character.baseFaith,
            totalIntelligence : character.baseIntelligence,
            createdBy : character.createdBy,
            items : character_items,
            class : character.character_class,
        }
        if(character_items){
            character_items.forEach(char_item => {

                if(char_item.item){
                    totalStatsDto.totalAgility += char_item.item.bonusAgility * char_item.quantity;
                    totalStatsDto.totalFaith += char_item.item.bonusFaith * char_item.quantity;
                    totalStatsDto.totalIntelligence += char_item.item.bonusIntelligence * char_item.quantity;
                    totalStatsDto.totalStrength += char_item.item.bonusStrength * char_item.quantity;
                }
             })
        } 
        return totalStatsDto;
    }

    async createCharacter(createCharacterDto : CreateCharacterDTO ,user : User){
        const char_class = await this.classRepository.findOneBy({id : createCharacterDto.class_id});
        const userId = (user as any)['userId'];
        const fill_user = await this.userRepository.findOneBy({id : userId}); //user by itself is not a proper typeORM property
        const newCharacter =  this.characterRepository.create({
            ...createCharacterDto,
            character_class : char_class,
            createdBy : fill_user 
        });

        
        return this.characterRepository.save(newCharacter);
    }
    findOne(userId : number){
        return this.characterRepository.findOneBy({
            id : userId
        })
    }
}
