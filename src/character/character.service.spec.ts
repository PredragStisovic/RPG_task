import { Test, TestingModule } from '@nestjs/testing';
import { CharacterService } from './character.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Character } from './entities/character.entity';
import { CharacterItem } from '../items/entities/character-item.entity';
import { Class } from './entities/class.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { User } from '../account/entities/user.entity';
import { Repository } from 'typeorm';

describe('CharacterService', () => {
  let service: CharacterService;
  let cacheManager: Cache;
  let characterRepository : jest.Mocked<Repository<Character>>;
  let userRepository : jest.Mocked<Repository<User>>;
  let classRepository : jest.Mocked<Repository<Class>>
  let user : User;
  

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };

  const mockQueryBuilder = {
    select : jest.fn().mockReturnThis(),
    getRawMany : jest.fn()
  }

  const mockCharacterRepository = {
    create : jest.fn(),
    save : jest.fn(),
    find : jest.fn(),
    createQueryBuilder : jest.fn(() => mockQueryBuilder)
  };

  const mockUserRepository = {
    findOneBy : jest.fn()
  };

  const mockClassRepository = {
    findOneBy : jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CharacterService,
        {
          provide : getRepositoryToken(Character),
          useValue : mockCharacterRepository
        },
        {
          provide : getRepositoryToken(User),
          useValue : mockUserRepository
        },
        {
          provide : getRepositoryToken(CharacterItem),
          useClass : CharacterItem
        },
        {
          provide : getRepositoryToken(Class),
          useValue : mockClassRepository
        },
        {
          provide : CACHE_MANAGER,
          useValue : mockCacheManager
        }
      ],
    }).compile();

    service = module.get<CharacterService>(CharacterService);
    characterRepository = module.get(getRepositoryToken(Character));
    userRepository = module.get(getRepositoryToken(User));
    classRepository = module.get(getRepositoryToken(Class));

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a character', async() => {
    const createCharacterDto = {
      name : "Eddenis",
      health : 150,
      mana : 50,
      baseStrength : 10,
      baseAgility : 20,
      baseIntelligence : 30,
      baseFaith : 40,
      class_id : 1
      
    }
    const user: any = { userId: 1 };

    const mockUser = { id: 1, username: 'test_user' } as User;
    const mockClass = { id: 1, name: 'Warrior' } as Class;
    const mockCharacter = { id: 1, name: 'Eddenis', health : 150, mana : 50, baseStrength : 10, baseAgility : 20, baseIntelligence : 30, baseFaith: 40 } as Character;

    userRepository.findOneBy.mockResolvedValue(mockUser);
    classRepository.findOneBy.mockResolvedValue(mockClass);
    characterRepository.create.mockReturnValue(mockCharacter);
    characterRepository.save.mockResolvedValue(mockCharacter);

    const result = await service.createCharacter(createCharacterDto, user);

    expect(classRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(characterRepository.create).toHaveBeenCalledWith({
      ...createCharacterDto,
      character_class: mockClass,
      createdBy: mockUser,
    });
    expect(characterRepository.save).toHaveBeenCalledWith(mockCharacter);
    expect(result).toEqual(mockCharacter);
  })

  it('should return all characters name, health and mana', async () => {
    const mockCharacters : Character[] = [
      { name : "Pera", health : 150, mana : 50} as Character,
      { name : "Mika", health : 200, mana : 60} as Character
    ]

    mockQueryBuilder.getRawMany.mockResolvedValue(mockCharacters);

    const res = await service.getAllCharacters();
    

    expect(characterRepository.createQueryBuilder).toHaveBeenCalledWith("user");
    expect(mockQueryBuilder.select).toHaveBeenCalledWith(["user.name", "user.health", "user.mana"]);
    expect(res).toEqual(mockCharacters);
  })

});
