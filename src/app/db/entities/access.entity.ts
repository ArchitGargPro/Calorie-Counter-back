import { BaseEntity, Column, Entity } from 'typeorm';

@Entity()
class AccessEntity extends  BaseEntity {
  @Column()
  userName: string;

  @Column()
  access: number;

  public static async getCurrentAccess(): Promise<number> {
    return ( await AccessEntity.findOne()).access;
  }

  public static async getCurrentUser(): Promise<string> {
    return ( await AccessEntity.findOne()).userName;
  }
}
export default AccessEntity;
