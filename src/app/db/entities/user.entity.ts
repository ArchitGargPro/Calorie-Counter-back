import { PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, Entity } from 'typeorm';
import UserInterface from '../../interfaces/user.interface';
import MealEntity from './meal.entity';

@Entity()
class UserEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userName: string;

    @Column()
    password: string;

    @Column()
    access: number;

    @OneToMany(type => MealEntity, meal => meal.userId)
    meals: MealEntity[];

    public static async findById(UID: string): Promise<UserInterface> {
        return UserEntity.findOne({ where: {UID} });
    }

}
export default UserEntity;
