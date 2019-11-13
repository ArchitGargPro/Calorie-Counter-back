interface CreateUserDTO {
  userName: string;
  password: string;
  access: number;
}

interface UpdateUserPasswordDTO {
  userName: string;
  password: string;
}

interface UpdateUserAccessDTO {
  userName: string;
  access: number;
}

export {
  CreateUserDTO,
  UpdateUserAccessDTO,
  UpdateUserPasswordDTO,
};
