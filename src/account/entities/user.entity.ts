import { Character } from "../../character/entities/character.entity";
import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
const bcrypt = require('bcrypt');

export enum RoleEnum{
    USER,
    GAMEMASTER
}

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    username : string;

    @Column()
    password : string;

    @Column({
        default : RoleEnum.USER
    })
    role : RoleEnum
    
    @OneToMany(() => Character, character => character.createdBy)
    characters : Character[]
}