import { DataSource } from "typeorm";
import { Duel } from "./combat/entities/duel.entity";
import { Character } from "./character/entities/character.entity";
import { Item } from "./items/entities/item.entity";
import { User } from "./account/entities/user.entity";
import { Class } from "./character/entities/class.entity";
import { config } from "dotenv";
import { CharacterItem } from "./items/entities/character-item.entity";


config();

export default new DataSource({
    type : 'postgres',
    host : process.env.POSTGRES_HOST,
    port : parseInt(process.env.POSTGRES_PORT),
    username : process.env.POSTGRES_USER,
    password : process.env.POSTGRES_PASSWORD,
    database : process.env.POSTGRES_DATABASE,
    synchronize : false,
    entities : [Duel,Character,Item,User,Class,CharacterItem],
    migrations : ['src/database/migrations/*.ts']
})