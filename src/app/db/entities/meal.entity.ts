import { PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';

export class MealEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'date' })
  date: string;

  @Column({ name: 'time' })
  time: string;

  @Column({ name: 'title' })
  title: string;

  @Column({ name: 'calories' })
  calories: number;

  @ManyToOne(type => UserEntity, user = user.meal, {
    eager: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

}
