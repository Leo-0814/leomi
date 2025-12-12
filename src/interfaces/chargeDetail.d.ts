export type ChargeDetailDataType = {
  id: string;
  name: string;
  total_value: number;
  fixed_income_value: number;
  fixed_expenses_value: number;
  driver_value: number;
  food_value: number;
  other_value: number;
  fixed_income: ChargeDetailItemType[];
  fixed_expenses: ChargeDetailItemType[];
  driver: ChargeDetailItemType[];
  food: ChargeDetailItemType[];
  other: ChargeDetailItemType[];
};

export type ChargeDetailItemType = {
  id: string;
  name: string;
  value: number;
  date: string;
  type?: string;
};

export type ChargeDetailParamsType = {
  id?: string;
  name?: string;
  type?: string;
};

export type ChargeDetailItemParamsType = {
  id?: string;
  parentId?: string;
  name?: string;
  value?: number;
  date?: string;
  type?: string;
};
