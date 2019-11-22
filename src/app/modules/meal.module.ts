import { Module } from '@nestjs/common';
import MealController from '../controllers/meal.controller';
import { MealService } from '../services/meal.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import MealEntity from '../db/entities/meal.entity';
import AuthenticationGuard from '../guards/authentication.guard';
import RolesGuard from '../guards/roles.guard';
import EAccess from '../enums/access.enum';
import AuthService from '../services/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([MealEntity])],
  controllers: [MealController],
  providers: [MealService, AuthService, AuthenticationGuard, {useValue: EAccess, provide: RolesGuard} ],
})

class MealModule {
}

export default MealModule;
