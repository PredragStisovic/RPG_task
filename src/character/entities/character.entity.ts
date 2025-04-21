import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Class } from "./class.entity";
import { User } from "../../account/entities/user.entity";
import { CharacterItem } from "../../items/entities/character-item.entity";


@Entity()
export class Character{
    @PrimaryGeneratedColumn()
    id : number

    @Column()
    name : string

    @Column()
    health : number

    @Column()
    mana : number

    @Column()
    baseStrength : number
    
    @Column()
    baseAgility : number
    
    @Column()
    baseIntelligence : number

    @Column()
    baseFaith : number

    @OneToMany(() => CharacterItem, character_item => character_item.character)
    character_items : CharacterItem[]

    @ManyToOne(() => Class, character_class => character_class.characters)
    character_class : Class

    @ManyToOne(() => User, user => user.characters)
    createdBy : User
}