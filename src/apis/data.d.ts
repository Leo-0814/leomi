export type requestType = {
  method: "get" | "post" | "put" | "delete" | "patch" | "head" | "options";
  path: string;
  data: object | null;
  needAuth: boolean;
  needCompanyId: boolean;
};

export type ApiResultCode = {
  httpStatus: number;
  code: number;
  message: string;
};

export type ApiResponse<T> = {
  result: ApiResultCode;
  data: { data: T };
};

export type FirebaseRequestOptions = {
  onSuccess?: (data: DataSnapshot) => void;
  onError?: (error: FirebaseError) => void;
};
