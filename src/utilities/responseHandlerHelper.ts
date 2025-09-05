export const getErrorCode = (err: any, defaultCode: number = 500) => {
  return err.code || defaultCode;
};

export const successResponse = (
  data: any = null,
  message: string = "Resource retrieved successfully."
) => {
  return {
    message,
    data,
  };
};

export const errorResponse = (
  err: any = {},
  defaultMessage: string = "Internal server error."
) => {
  return {
    errors: {
      common: {
        msg: err.message || (defaultMessage as string),
      },
    },
  };
};
