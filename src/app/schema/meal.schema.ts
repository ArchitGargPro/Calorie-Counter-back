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

interface IDates {
  fromDate: string;
  toDate: string;
}

interface ITime {
  fromTime: string;
  toTime: string;
}

export {
  CreateMealDTO,
  UpdateMealCalorieDTO,
  UpdateMealTitleDTO,
  IDates,
  ITime,
};
