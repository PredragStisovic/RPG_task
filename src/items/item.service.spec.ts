import { Test, TestingModule } from "@nestjs/testing";
import { ItemService } from "./item.service"
import { Repository } from "typeorm";
import { Item } from "./entities/item.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { CharacterItem } from "./entities/character-item.entity";
import { CharacterService } from "../character/character.service";




describe('ItemService', () =>{
    let service : ItemService;
    let itemRepository : jest.Mocked<Repository<Item>>;
    let characterItemRepository : jest.Mocked<Repository<CharacterItem>>;
    let cacheManager : Cache

    const mockItemRepository = {
        find : jest.fn(),
        findOneBy : jest.fn(),
        save : jest.fn(),
        create : jest.fn()
    }

    const mockCharacterItemRepository = {
        findOneBy : jest.fn(),
        create : jest.fn(),
        save : jest.fn()
    }
   
    const mockCacheManager = {
        get: jest.fn(),
        set: jest.fn(),
        del: jest.fn(),
    }

    const mockCharacterService = {
        getACharacter : jest.fn()
    }

      beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
          providers: [ItemService, CharacterService,
            {
                provide : getRepositoryToken(Item),
                useValue : mockItemRepository
            },
            {
                provide : CACHE_MANAGER,
                useValue : mockCacheManager
            },
            {
                provide : getRepositoryToken(CharacterItem),
                useValue : mockCharacterItemRepository
            },
            {
                provide : CharacterService,
                useValue : mockCharacterService
            }
          ],
        }).compile();
        
        service = module.get<ItemService>(ItemService);
        itemRepository = module.get(getRepositoryToken(Item));
    });

    it('Should be defined', () =>{
        expect(service).toBeDefined();
    })

    it('Should return all items', async () => {
        const mockItems : Item[] = [
            {
                id : 1,
                name : 'B.F. Sword',
                description : 'Strongest sword there is',
                bonusStrength : 40,
                bonusAgility : 20,
                bonusIntelligence : 30,
                bonusFaith : 10,
                character_items : []
            },
            {
                id : 2,
                name : 'Rod of Ages',
                description : 'Aged like fine wine',
                bonusStrength : 10,
                bonusAgility : 10,
                bonusIntelligence : 40,
                bonusFaith : 20,
                character_items : []
            }
        ]
        mockItemRepository.find.mockResolvedValue(mockItems);
        const res = await service.getAllItems();
        expect(res).toEqual(mockItems);
    })

    it('Should create an item',async () => {
        const createItemDto = {
            name: "New item",
            description : "Newest item ever",
            bonusStrength : 1,
            bonusAgility : 1,
            bonusIntelligence : 1,
            bonusFaith : 1,
        }
        const mockItem = {
            name: "New item",
            description : "Newest item ever",
            bonusStrength : 1,
            bonusAgility : 1,
            bonusIntelligence : 1,
            bonusFaith : 1,
        } as Item

        mockItemRepository.save.mockResolvedValue(mockItem);


        const res = await service.createItem(createItemDto);

        expect(itemRepository.save).toHaveBeenCalledWith(mockItem);
        expect(res).toEqual(mockItem);
    })

    it('Should create Character item if it doesnt exist and grant it to a character',async () => {
        const assignItemDto = {
            itemId : 1,
            assignTo : 2
        } 
        
        mockItemRepository.findOneBy.mockResolvedValue({id : 1});
        mockCharacterService.getACharacter.mockResolvedValue({id : '2'});
        mockCharacterItemRepository.findOneBy.mockResolvedValue(null);
        mockCharacterItemRepository.create.mockReturnValue({ characterId : 2 , itemId : 1, quantity : 1});
        mockCharacterItemRepository.save.mockResolvedValue({});
        mockCacheManager.del.mockResolvedValue(undefined);

        const res = await service.grantItem(assignItemDto);

        expect(mockItemRepository.findOneBy).toHaveBeenCalledWith({id : 1});
        expect(mockCharacterService.getACharacter).toHaveBeenCalledWith('2');
        expect(mockCharacterItemRepository.create).toHaveBeenCalledWith({ characterId: 2, itemId: 1, quantity: 1 });
        expect(mockCharacterItemRepository.save).toHaveBeenCalled();
        expect(mockCacheManager.del).toHaveBeenCalledWith('2');
        expect(res).toBe('Item is added to character');
    })
    it('Should increment quantity if CharacterItem already exists', async () => {
        const dto = { itemId: 1, assignTo: 2 };
      
        const existingItem = { characterId: 2, itemId: 1, quantity: 1 };
      
        mockItemRepository.findOneBy.mockResolvedValue({ id: 1 });
        mockCharacterService.getACharacter.mockResolvedValue({ id: 2 });
        mockCharacterItemRepository.findOneBy.mockResolvedValue(existingItem);
        mockCharacterItemRepository.save.mockResolvedValue({});
        mockCacheManager.del.mockResolvedValue(undefined);
      
        const result = await service.grantItem(dto);
      
        expect(existingItem.quantity).toBe(2);
        expect(mockCharacterItemRepository.save).toHaveBeenCalledWith(existingItem);
        expect(result).toBe('Item is added to character');
      });
})