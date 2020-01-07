interface CreateMealDTO {
  title: string;
  calorie: number;
  userName?: string;
}

interface IDates {
  fromDate: string;
  toDate: string;
  userName?: string;
}

interface ITime {
  fromTime: string;
  toTime: string;
  userName?: string;
}

interface IUpdateMealDTO {
  id: number;
  title?: string;
  calorie?: number;
  userName?: string;
}

export {
  CreateMealDTO,
  IUpdateMealDTO,
  IDates,
  ITime,
};
