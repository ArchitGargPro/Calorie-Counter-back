import UserEntity from '../db/entities/user.entity';

interface AuthDetail {
  currentUser: UserEntity;
}

export default AuthDetail;
