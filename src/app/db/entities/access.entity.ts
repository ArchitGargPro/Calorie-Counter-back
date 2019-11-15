import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import EAccess from '../../enums/access.enum';

@Entity()
class AccessEntity extends BaseEntity {

  @Column({
    nullable: true,
  })
  userName: string;

  @PrimaryColumn()
  access: number;

  private static async currentUser(): Promise<AccessEntity> {
    let current = await AccessEntity.find();
    let n = current.length;
    if (n === 0) {
      await this.InitializeAccess();
      current = await AccessEntity.find();
    }
    n = current.length;
    return current[n - 1];
  }

  public static async getCurrentAccess(): Promise<number> {
    return (await this.currentUser()).access;
  }

  public static async getCurrentUser(): Promise<string> {
    return (await this.currentUser()).userName;
  }

  public static async InitializeAccess(): Promise<any> {
    // tslint:disable-next-line:no-console
    const accessToken: AccessEntity = await AccessEntity.findOne({where: {id: 1}});
    if (!accessToken) {
      await AccessEntity.insert({
        userName: 'null',
        access: EAccess.DEFAULT,
      });
    } else {
      accessToken.access = EAccess.DEFAULT;
      await AccessEntity.save(accessToken);
    }
  }

  public static async logOut(): Promise<any> {
    let current = await AccessEntity.find();
    if (current.length === 0 ) {
      return 'no user logged In, LOL';
    } else {
      if (current[0].userName === 'null') {
        await AccessEntity.remove(current[0]);
      }
      if (current.length === 0) {
        return 'no user logged In, LOL';
      } else {
        // console.log('deleting the user access ...', current );
        current = await AccessEntity.find();
        return AccessEntity.remove(current[0]);
      }
    }
  }
}
export default AccessEntity;
