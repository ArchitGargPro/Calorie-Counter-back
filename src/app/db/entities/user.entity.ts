import { PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from 'typeorm';
import { MealEntity } from './meal.entity';

export class UserEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userName: string;

    @Column()
    password: string;

    @Column()
    access: number;

    @OneToMany(type => MealEntity, meal = meal.user)
    meal: MealEntity[];

}
