interface CreateMealDTO {
  title: string;
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
  IDates,
  ITime,
};
