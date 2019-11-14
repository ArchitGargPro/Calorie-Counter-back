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

  public static async getCurrentAccess(): Promise<number> {
    let current = await AccessEntity.find();
    if (!current) {
      await this.InitializeAccess();
      current = await AccessEntity.find();
    }
    const n = current.length;
    return current[n - 1].access;
  }

  public static async getCurrentUser(): Promise<string> {
    let current = await AccessEntity.find();
    if (!current) {
      await this.InitializeAccess();
      current = await AccessEntity.find();
    }
    const n = current.length;
    return current[n - 1].userName;
  }

  public static async InitializeAccess(): Promise<any> {
    // tslint:disable-next-line:no-console
    console.log(' Init ...');
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
    const current = await AccessEntity.find();
    if (current.length === 0) {
      return 'no user logged In, LOL';
    } else {
      // console.log('deleting the user access ...', current );
      return await AccessEntity.remove( current[0] );
    }
  }
}
export default AccessEntity;
