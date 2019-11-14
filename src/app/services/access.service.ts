import { Injectable } from '@nestjs/common';
import AccessEntity from '../db/entities/access.entity';

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
    console.log('hereee');
    let accessToken: AccessEntity = await AccessEntity.findOne();
    console.log('hereee1');
    if (!accessToken) {
      await AccessEntity.InitializeAccess();
    }
    accessToken = await AccessEntity.findOne();
    accessToken.userName = userName;
    accessToken.access = access;
    console.log('hereee2');
    await AccessEntity.save(accessToken);
  }

  async logOut(): Promise<any> {
    return await AccessEntity.logOut();
  }
}
