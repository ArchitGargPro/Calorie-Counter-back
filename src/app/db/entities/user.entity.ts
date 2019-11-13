import { PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from 'typeorm';
import { MealEntity } from './meal.entity';
import UserInterface from '../../interfaces/user.interface';

class UserEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userName: string;

    @Column()
    password: string;

    @Column({
        length: 1,
    })
    access: number;

    @OneToMany(type => MealEntity, meal => meal.userId)
    meals: MealEntity[];

    public static async findById(UID: string): Promise<UserInterface> {
        return UserEntity.findOne({ where: {UID} });
    }

}
export default UserEntity;
