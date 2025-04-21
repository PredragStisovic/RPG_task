import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

describe('AccountService', () => {
  let service: AccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountService, JwtService, {
        provide : getRepositoryToken(User),
        useClass : Repository
      }],
    }).compile();

    service = module.get<AccountService>(AccountService);
    const characterRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
