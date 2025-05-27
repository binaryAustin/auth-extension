import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dtos/create-coffee.dto';
import { UpdateCoffeeDto } from './dtos/update-coffee.dto';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { CurrentUser } from 'src/iam/types/current-user.type';
import { Auth } from 'src/iam/authentication/decorators/auth.decorator';
import { AuthType } from 'src/iam/authentication/enums/auth-type.enum';
import { Roles } from 'src/iam/authorization/decorators/roles.decorator';
import { Role } from 'src/users/enums/role.enum';
import { Permissions } from 'src/iam/authorization/decorators/permissions.decorator';
import { Permission } from 'src/iam/authorization/types/permission.type';
import { Policies } from 'src/iam/authorization/decorators/policies.decorator';
import { FrameworkContributorPolicy } from 'src/iam/authorization/policies/framework-contributor.policy';

@Auth(AuthType.Bearer, AuthType.ApiKey)
@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {}

  @Policies(new FrameworkContributorPolicy())
  // @Roles(Role.Admin)
  // @Permissions(Permission.CreateCoffee)
  @Post()
  create(@Body() createCoffeeDto: CreateCoffeeDto) {
    return this.coffeesService.create(createCoffeeDto);
  }

  @Get()
  findAll(@ActiveUser() user: CurrentUser) {
    console.log(user);
    return this.coffeesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coffeesService.findOne(+id);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCoffeeDto: UpdateCoffeeDto) {
    return this.coffeesService.update(+id, updateCoffeeDto);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coffeesService.remove(+id);
  }
}
