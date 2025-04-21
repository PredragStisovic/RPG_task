import { User } from "src/account/entities/user.entity";
import { Class } from "../entities/class.entity"


export class CreateCharacterDTO{
        name : string;
        health : number;
        mana : number;
        baseStrength : number;
        baseAgility : number;
        baseIntelligence : number;
        baseFaith : number;
        class_id : number;
}