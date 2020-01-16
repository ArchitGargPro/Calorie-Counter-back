interface CreateMealDTO {
  title: string;
  calorie: number;
  date?: string;
  time?: string;
  userName?: string;
}

// interface IDates {
//   fromDate: string;
//   toDate: string;
//   userName?: string;
// }
//
// interface ITime {
//   fromTime: string;
//   toTime: string;
//   userName?: string;
// }

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
  userName?: string;
}

export {
  CreateMealDTO,
  IUpdateMealDTO,
  IFilters,
  // IDates,
  // ITime,
};
