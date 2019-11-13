interface AddUserDTO {
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
  AddUserDTO,
  UpdateUserAccessDTO,
  UpdateUserPasswordDTO,
};
