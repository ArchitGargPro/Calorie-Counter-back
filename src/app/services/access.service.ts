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
    const accessToken: AccessEntity = await AccessEntity.findOne();
    accessToken.userName = userName;
    accessToken.access = access;
    await AccessEntity.save(accessToken);
  }
}
