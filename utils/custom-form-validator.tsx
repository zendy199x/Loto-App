export const customFormValidator = (
  condition: (value: any) => boolean,
  errorMessage: string
) => {
  return (_: any, value: any) => {
    if (condition(value)) {
      return Promise.resolve();
    }

    return Promise.reject(errorMessage);
  };
};
