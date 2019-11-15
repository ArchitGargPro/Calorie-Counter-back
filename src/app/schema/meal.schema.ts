interface CreateMealDTO {
  title: string;
  calorie: number;
}

interface UpdateMealTitleDTO {
  id: number;
  title: string;
}

interface UpdateMealCalorieDTO {
  id: number;
  calorie: number;
}

export {
  CreateMealDTO,
  UpdateMealCalorieDTO,
  UpdateMealTitleDTO,
};
