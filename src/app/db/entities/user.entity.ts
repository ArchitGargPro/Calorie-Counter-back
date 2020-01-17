import { PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, Entity, BeforeInsert } from 'typeorm';
import MealEntity from './meal.entity';
import * as Bcrypt from 'bcryptjs';

@Entity()
class UserEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userName: string;

    @Column()
    password: string;

    @Column()
    name: string;

    @Column()
    access: number;

    @Column()
    calorie: number;

    @OneToMany(() => MealEntity, meal => meal.userId)
    meals: MealEntity[];

    @BeforeInsert()
    public async beforeInsertHooks() {
        this.password = Bcrypt.hashSync(this.password, 10); // Hash password
    }

    // public static toJSONArray(userEntity: UserEntity[]): IUser[] {
    //     return pick(userEntity, ['id', 'name', 'userName', 'access', 'calorie']);
    //     // return userEntity;
    // }
    //
    // public static toJSON(userEntity: UserEntity): IUser {
    //     return pick(userEntity, ['id', 'name', 'userName', 'access', 'calorie']);
    // }

    public static async findById(id: number): Promise<UserEntity> {
        return await UserEntity.findOne({ where: {id} });
    }

    public static async findByUserName(userName: string): Promise<UserEntity> {
        return await UserEntity.findOne({
            select: ['id', 'userName', 'name', 'access', 'calorie'],
            where: {userName},
        });
    }

    public static async getUserByUserName(userName: string): Promise<UserEntity> {
        return await UserEntity.findOne({ where: {userName} });
    }

    public static async removeUser(userName: string): Promise<UserEntity> {
        return await UserEntity.remove(await UserEntity.findOne({ where: {userName} }));
    }
}
export default UserEntity;
