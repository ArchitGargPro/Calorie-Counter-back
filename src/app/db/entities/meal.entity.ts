import { PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn, Entity } from 'typeorm';
import UserEntity from './user.entity';

@Entity()
class MealEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'date' })
  date: string;

  @Column({ name: 'time' })
  time: string;

  @Column({ name: 'title' })
  title: string;

  @Column({ name: 'calorie' })
  calorie: number;

  @ManyToOne(type => UserEntity, user => user.meals, {
    eager: true,
  })
  @JoinColumn({ name: 'userId' })
  userId: UserEntity;

}

export default MealEntity;
