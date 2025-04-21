import { User } from "src/account/entities/user.entity";
import { Class } from "../entities/class.entity";
import { CharacterItem } from "src/items/entities/character-item.entity";


export class totalStatsDTO{
    name : string;
    health : number;
    mana : number;
    class : Class;
    createdBy : User;
    items : CharacterItem[];
    totalStrength : number;
    totalAgility : number;
    totalIntelligence : number;
    totalFaith : number;
}