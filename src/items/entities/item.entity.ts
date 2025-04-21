import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CharacterItem } from "./character-item.entity";


@Entity()
export class Item{
    @PrimaryGeneratedColumn()
    id : number

    @Column()
    name : string

    @Column()
    description : string

    @Column()
    bonusStrength : number
    
    @Column()
    bonusAgility : number
    
    @Column()
    bonusIntelligence : number
    
    @Column()
    bonusFaith : number

    @OneToMany(() => CharacterItem, character_item => character_item.character)
    character_items : CharacterItem[]
}