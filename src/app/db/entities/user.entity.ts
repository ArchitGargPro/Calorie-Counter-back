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

    // public toJSON(userEntity: UserEntity | UserEntity[]): any {
    //     // return lodash.pick(userEntity, ['name', 'userName', 'access', 'calorie']);
    //     return userEntity;
    // }

    public static async findById(id: number): Promise<UserEntity> {
        return await UserEntity.findOne({ where: {id} });
    }

    public static async findByUserName(userName: string): Promise<UserEntity> {
        return await UserEntity.findOne({ where: {userName} });
    }

    public static async getUserByUserName(userName: string): Promise<UserEntity> {
        return await UserEntity.findOne({ where: {userName} });
    }

    public static async removeUser(userName: string): Promise<UserEntity> {
        return await UserEntity.remove(await UserEntity.findOne({ where: {userName} }));
    }
}
export default UserEntity;
