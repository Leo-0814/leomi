export type SettingsDataType = {
  total_value: number;
  fixed_income_value: number;
  fixed_expenses_value: number;
  fixed_income: SettingsItemType[];
  fixed_expenses: SettingsItemType[];
};

export type SettingsItemType = {
  id: string;
  name: string;
  value: number;
  type?: string;
};

export type SettingsParamsType = {
  id?: string;
  name?: string;
  type?: string;
};

export type SettingsItemParamsType = {
  id?: string;
  name?: string;
  value?: number;
  type?: string;
};
