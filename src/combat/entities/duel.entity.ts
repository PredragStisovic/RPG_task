import { Character } from "src/character/entities/character.entity";
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Duel{
    @PrimaryGeneratedColumn()
    duelId : number;

    @ManyToOne(() => Character)
    challenger : Character

    @ManyToOne(() => Character)
    challenged : Character

    @Column()
    challengerHealth : number

    @Column()
    challengedHealth : number

    @Column({
        type : 'timestamp',
        default : () => 'now()'
    })
    duelStart : Date;

    @Column({
        type : 'timestamp'
    })
    lastAttackChallenger? : Date;


    @Column({
        type : 'timestamp'
    })
    lastCastChallenger? : Date;


    @Column({
        type : 'timestamp'
    })
    lastHealChallenger? : Date;

    @Column({
        type : 'timestamp'
    })
    lastAttackChallenged? : Date;


    @Column({
        type : 'timestamp'
    })
    lastCastChallenged? : Date;


    @Column({
        type : 'timestamp'
    })
    lastHealChallenged? : Date;


    @Column()
    turn : number;
}