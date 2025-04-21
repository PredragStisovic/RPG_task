import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { JWTAuthGuard } from "src/account/jwt.auth.guard";
import { ItemService } from "./item.service";
import { createItemDTO } from "./dtos/create-item.dto";
import { AssignItemDTO } from "./dtos/assign-item.dto";
import { GiftItemDTO } from "./dtos/gift-item.dto";
import { Roles } from "src/authorization/roles.decorator";
import { RoleEnum } from "src/account/entities/user.entity";
import { RolesGuard } from "src/authorization/roles.guard";


@Controller('items')
@UseGuards(JWTAuthGuard, RolesGuard)
export class ItemController{
    constructor(
        private readonly itemService : ItemService
    ){}

    @Get()
    @Roles(RoleEnum.GAMEMASTER)
    getAllItems(){
        return this.itemService.getAllItems();
    }

    @Get(':id')
    retreiveItemDetails(@Param('id') id : string){
        return this.itemService.retreiveItemDetails(+id);
    }
    
    @Post()
    createItem(@Body() createItemDto : createItemDTO){
        return this.itemService.createItem(createItemDto);
    }

    @Post('grant')
    grantItem(@Body() assignItemDto : AssignItemDTO){
        return this.itemService.grantItem(assignItemDto);
    }

    @Post('gift')
    giftItem(@Body() giftItemDto : GiftItemDTO){
        return this.itemService.giftItem(giftItemDto);
    }
    

}