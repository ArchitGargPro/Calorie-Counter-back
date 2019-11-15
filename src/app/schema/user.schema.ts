interface CreateUserDTO {
  userName: string;
  password: string;
  access: number;
}

interface UpdateUserDTO {
  userName: string;
  password: string;
  access: number;
  calorie: number;
}

interface UpdateUserPasswordDTO {
  userName: string;
  password: string;
}

interface UpdateUserAccessDTO {
  userName: string;
  access: number;
}

interface UpdateUserExpectation {
  userName: string;
  calorie: number;
}

enum EDefault {
  EXPECTED_CALORIE = 2000,
}

export {
  CreateUserDTO,
  UpdateUserDTO,
  UpdateUserAccessDTO,
  UpdateUserPasswordDTO,
  UpdateUserExpectation,
  EDefault,
};
