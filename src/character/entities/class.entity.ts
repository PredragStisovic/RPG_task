import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Character } from "./character.entity";

@Entity()
export class Class{
    @PrimaryGeneratedColumn()
    id : number

    @Column()
    name : string

    @Column()
    description : string

    @OneToMany(() => Character, character => character.character_class)
    characters : Character[]
}