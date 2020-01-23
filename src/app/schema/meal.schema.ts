interface CreateMealDTO {
  title: string;
  calorie: number;
  date?: string;
  time?: string;
  userName?: string;
}

interface IPerDay {
  date: string;
  sum: number;
}

interface IFilters {
  id?: number;
  fromDate?: string;
  toDate?: string;
  fromTime?: string;
  toTime?: string;
  fromCalorie?: number;
  toCalorie?: number;
  title?: string;
  userName?: string;
}

interface IUpdateMealDTO {
  id: number;
  title?: string;
  calorie?: number;
  date?: string;
  time?: string;
}

export {
  CreateMealDTO,
  IUpdateMealDTO,
  IFilters,
  IPerDay,
};
