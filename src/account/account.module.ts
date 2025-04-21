import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
  imports:[TypeOrmModule.forFeature([User]), PassportModule, ConfigModule,
    JwtModule.registerAsync({
    imports : [ConfigModule],
    useFactory : async (configService : ConfigService) =>({
      secret : configService.get<string>('JWT_SECRET'),
      signOptions:{
        expiresIn : '30d'
      }
    }),
    inject : [ConfigService]
  })
  ],
  controllers: [AccountController],
  providers: [AccountService, JwtStrategy, LocalStrategy],
})
export class AccountModule {}
