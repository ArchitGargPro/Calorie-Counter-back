import { Injectable } from '@nestjs/common';
import AccessEntity from '../db/entities/access.entity';
import EAccess from '../enums/access.enum';

@Injectable()
export class AccessService {

  async getAccess(): Promise<number> {
    return await AccessEntity.getCurrentAccess();
  }

  async getCurrentUser(): Promise<string> {
    const user =  await AccessEntity.getCurrentUser();
    if ( !user ) {
      return 'no user logged In';
    } else {
      return user;
    }
  }

  async UpdateAccess(userName: string, access: number) {
    const accessToken: AccessEntity = await AccessEntity.findOne();
    accessToken.userName = userName;
    accessToken.access = access;
    await AccessEntity.save(accessToken);
  }

  async InitializeAccess() {
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
