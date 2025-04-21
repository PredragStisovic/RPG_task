import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService} from '@nestjs/config';
import { AccountModule } from './account/account.module';
import { CharacterModule } from './character/character.module';
import { ItemModule } from './items/item.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { CombatModule } from './combat/combat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports : [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: +configService.get<number>('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DATABASE'),
        autoLoadEntities: true,
        synchronize: false, 
      }),
      inject: [ConfigService],
    }),
    CacheModule.register({
      isGlobal : true,
      store : redisStore,
      host : 'localhost',
      port : 6379
    }),
    AccountModule,
    CharacterModule,
    ItemModule,
    CombatModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
