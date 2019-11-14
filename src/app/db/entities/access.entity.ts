import { BaseEntity, Column, Entity } from 'typeorm';
import EAccess from '../../enums/access.enum';

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

  public static async InitializeAccess(): Promise<any> {
    // tslint:disable-next-line:no-console
    console.log('logging out ...');
    const accessToken: AccessEntity = await AccessEntity.findOne();
    if (!accessToken) {
      await AccessEntity.insert({
        access: EAccess.DEFAULT,
      });
    } else {
      accessToken.access = EAccess.DEFAULT;
      await AccessEntity.save(accessToken);
    }
  }
}
export default AccessEntity;
