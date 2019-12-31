interface CreateUserDTO {
  name: string;
  userName: string;
  password: string;
  access?: number;
}

interface UpdateUserDTO {
  userName: string;
  password?: string;
  access?: number;
  calorie?: number;
}

enum EDefault {
  EXPECTED_CALORIE = 2000,
}

export {
  CreateUserDTO,
  UpdateUserDTO,
  EDefault,
};
