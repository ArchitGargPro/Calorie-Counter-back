interface CreateMealDTO {
  date: string;
  time: string;
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
