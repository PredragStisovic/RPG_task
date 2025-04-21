import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAllMigration1745249316114 implements MigrationInterface {
    name = 'CreateAllMigration1745249316114'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "class" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_0b9024d21bdfba8b1bd1c300eae" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "role" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "item" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "bonusStrength" integer NOT NULL, "bonusAgility" integer NOT NULL, "bonusIntelligence" integer NOT NULL, "bonusFaith" integer NOT NULL, CONSTRAINT "PK_d3c0c71f23e7adcf952a1d13423" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "character_item" ("characterId" integer NOT NULL, "itemId" integer NOT NULL, "quantity" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_5efd657c750b7ed2e0bb0bb2386" PRIMARY KEY ("characterId", "itemId"))`);
        await queryRunner.query(`CREATE TABLE "character" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "health" integer NOT NULL, "mana" integer NOT NULL, "baseStrength" integer NOT NULL, "baseAgility" integer NOT NULL, "baseIntelligence" integer NOT NULL, "baseFaith" integer NOT NULL, "characterClassId" integer, "createdById" integer, CONSTRAINT "PK_6c4aec48c564968be15078b8ae5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "duel" ("duelId" SERIAL NOT NULL, "challengerHealth" integer NOT NULL, "challengedHealth" integer NOT NULL, "duelStart" TIMESTAMP NOT NULL DEFAULT now(), "lastAttackChallenger" TIMESTAMP NOT NULL, "lastCastChallenger" TIMESTAMP NOT NULL, "lastHealChallenger" TIMESTAMP NOT NULL, "lastAttackChallenged" TIMESTAMP NOT NULL, "lastCastChallenged" TIMESTAMP NOT NULL, "lastHealChallenged" TIMESTAMP NOT NULL, "turn" integer NOT NULL, "challengerId" integer, "challengedId" integer, CONSTRAINT "PK_d3c835a514a4a28c01029f4bf35" PRIMARY KEY ("duelId"))`);
        await queryRunner.query(`ALTER TABLE "character_item" ADD CONSTRAINT "FK_a533a7339e040463d5d2bfa7da6" FOREIGN KEY ("characterId") REFERENCES "character"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "character_item" ADD CONSTRAINT "FK_a9ccbb5fe58c0fcc9be39bda7ea" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "character" ADD CONSTRAINT "FK_93aa19395151af9dba61b4d8708" FOREIGN KEY ("characterClassId") REFERENCES "class"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "character" ADD CONSTRAINT "FK_77014598914faf7fa4de210a865" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "duel" ADD CONSTRAINT "FK_cfbdd5e2d67a67e6621b8053729" FOREIGN KEY ("challengerId") REFERENCES "character"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "duel" ADD CONSTRAINT "FK_6070088300eb723d0bd32e0bf55" FOREIGN KEY ("challengedId") REFERENCES "character"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`INSERT INTO "class" ("name", "description") VALUES ('Warrior', 'Strong in hand to hand combat, master at arms'), ('Mage', 'Caster wielding arcane energy to cast powerful spells'), ('Rogue', 'Master of shadows, agile and strong in doing things swiftly and elegantly')`);
        await queryRunner.query(`INSERT INTO "user" ("username", "password", "role") VALUES ('admin', 'adminpass', 1), ('player', 'playerpass', 0)`);
        await queryRunner.query(`INSERT INTO "item" ("name", "description", "bonusStrength", "bonusAgility", "bonusIntelligence", "bonusFaith") VALUES ('Long Sword', 'Great for close combat', 5, 2, 0, 0), ('Large rod', 'Casting wonders', 0, 1, 6, 0), ('Holy Cape', 'Cape that gives faith even to the least believing', 0, 0, 0, 10)`);
        await queryRunner.query(`INSERT INTO "character" ("name", "health", "mana", "baseStrength", "baseAgility", "baseIntelligence", "baseFaith", "characterClassId", "createdById") VALUES  ('Godbrand', 100, 50, 10, 5, 2, 1, 1, 1), ('Satori', 80, 80, 3, 4, 10, 2, 2, 2), ('Yoru', 80, 80, 3, 4, 10, 2, 3, 2)`);
        await queryRunner.query(`INSERT INTO "character_item" ("characterId", "itemId", "quantity") VALUES (1, 1, 1), (2, 2, 1), (2, 3, 2)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "duel" DROP CONSTRAINT "FK_6070088300eb723d0bd32e0bf55"`);
        await queryRunner.query(`ALTER TABLE "duel" DROP CONSTRAINT "FK_cfbdd5e2d67a67e6621b8053729"`);
        await queryRunner.query(`ALTER TABLE "character" DROP CONSTRAINT "FK_77014598914faf7fa4de210a865"`);
        await queryRunner.query(`ALTER TABLE "character" DROP CONSTRAINT "FK_93aa19395151af9dba61b4d8708"`);
        await queryRunner.query(`ALTER TABLE "character_item" DROP CONSTRAINT "FK_a9ccbb5fe58c0fcc9be39bda7ea"`);
        await queryRunner.query(`ALTER TABLE "character_item" DROP CONSTRAINT "FK_a533a7339e040463d5d2bfa7da6"`);
        await queryRunner.query(`DROP TABLE "duel"`);
        await queryRunner.query(`DROP TABLE "character"`);
        await queryRunner.query(`DROP TABLE "character_item"`);
        await queryRunner.query(`DROP TABLE "item"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "class"`);
    }

}
