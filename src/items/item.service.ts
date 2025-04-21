import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Item } from "./entities/item.entity";
import { Repository } from "typeorm";
import { createItemDTO } from "./dtos/create-item.dto";
import { AssignItemDTO } from "./dtos/assign-item.dto";
import { CharacterService } from "../character/character.service";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { GiftItemDTO} from "./dtos/gift-item.dto";
import { CharacterItem } from "./entities/character-item.entity";


@Injectable()
export class ItemService{
    constructor(
        @InjectRepository(Item)
        private readonly itemRepository : Repository<Item>,

        @InjectRepository(CharacterItem)
        private readonly characterItemRepository : Repository<CharacterItem>,

        @Inject(CACHE_MANAGER)
        private cacheManager : Cache,

        private readonly characterService : CharacterService
    ){}

    getAllItems(){
        return this.itemRepository.find();
    }

    async retreiveItemDetails(itemId : number){
        const item = await this.itemRepository.findOneBy({id : itemId});
        const maxStat = Math.max(item.bonusAgility, item.bonusFaith, item.bonusIntelligence, item.bonusStrength)
        Object.keys(item).forEach(key => {
            if(key != 'id' && item[key] === maxStat){
                item.name = item.name + " +" + key.slice(5);
            }
        })
        return item;
    }

    createItem(createItemDto : createItemDTO){
        return this.itemRepository.save(createItemDto);
    }

    async grantItem(assignItemDto : AssignItemDTO){
        const item = await this.itemRepository.findOneBy({id : assignItemDto.itemId});
        if(!item){
            throw new NotFoundException('Item not found');
        }
        const assignTo = await this.characterService.getACharacter(assignItemDto.assignTo.toString());
        if(!assignTo){
            throw new NotFoundException('Character with this ID does not exist');
        }
        let char_item = await this.characterItemRepository.findOneBy({characterId : assignItemDto.assignTo, itemId : assignItemDto.itemId});
        if(!char_item){
            char_item = this.characterItemRepository.create({
                characterId : assignItemDto.assignTo,
                itemId : assignItemDto.itemId,
                quantity : 1
            })
        }
        else{
            char_item.quantity += 1
        }
        this.characterItemRepository.save(char_item);
        this.cacheManager.del(assignItemDto.assignTo.toString());
        return "Item is added to character";
    }

    async giftItem(giftItemDto : GiftItemDTO){
        const assignFrom = await this.characterService.getACharacter(giftItemDto.assignFrom.toString());
        if(!assignFrom){
            throw new NotFoundException('Character that has to give a gift,with this ID, does not exist');
        }

        const assignTo = await this.characterService.getACharacter(giftItemDto.assignTo.toString());
        if(!assignTo){
            throw new NotFoundException('Character that has to receive the gift,with this ID, does not exist');
        }

        const characterItems = await this.characterItemRepository.find({
            where : {characterId : giftItemDto.assignFrom},
        })
        if(!characterItems || characterItems.length === 0){
            throw new NotFoundException("This character has no items");
        }

        const item_to_give = characterItems[Math.floor(Math.random()*characterItems.length)];
        if(item_to_give.quantity > 1){
            item_to_give.quantity -= 1
            await this.characterItemRepository.save(item_to_give);
        } else{
            await this.characterItemRepository.remove(item_to_give);
        }

        let item_to_receive = await this.characterItemRepository.findOneBy(
            { characterId : giftItemDto.assignTo, itemId : item_to_give.itemId }
        )
        if(!item_to_receive){
            item_to_receive = this.characterItemRepository.create({
                characterId : giftItemDto.assignTo,
                itemId : item_to_give.itemId,
                quantity : 1
            })
        }  else{
            item_to_receive.quantity += 1;
        }
        await this.characterItemRepository.save(item_to_receive);

        this.cacheManager.del(giftItemDto.assignTo.toString());
        this.cacheManager.del(giftItemDto.assignFrom.toString());
        return "Item successfully traded";

    }
}