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

    @OneToMany(() => MealEntity, meal => meal.userId)
    meals: MealEntity[];

    public static async findById(id: string): Promise<UserInterface> {
        return UserEntity.findOne({ where: {id} });
    }

    public static async findByUserName(userName: string): Promise<UserInterface> {
        return UserEntity.findOne({ where: {userName} });
    }

    public static async getUserByUserName(userName: string): Promise<UserEntity> {
        return UserEntity.findOne({ where: {userName} });
    }

    public static async removeUser(userName: string): Promise<UserInterface> {
        return UserEntity.remove(await UserEntity.findOne({ where: {userName} }));
    }
}
export default UserEntity;
