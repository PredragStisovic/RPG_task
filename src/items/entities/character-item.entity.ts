import { Character } from "../../character/entities/character.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Item } from "./item.entity";


@Entity()
export class CharacterItem{
    @PrimaryColumn()
    characterId : number;

    @PrimaryColumn()
    itemId : number;

    @Column({
        default : 0
    })
    quantity : number;

    @ManyToOne(() => Character, character => character.character_items)
    @JoinColumn([
        {name : "characterId", referencedColumnName : "id"}
    ])
    character : Character;

    @ManyToOne(() => Item, item => item.character_items)
    @JoinColumn([
        {name : "itemId", referencedColumnName : "id"}
    ])
    item : Item
}