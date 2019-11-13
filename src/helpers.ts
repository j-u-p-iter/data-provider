import { AxiosPromise } from "axios";

export const extractData = async <T = any>(
  request: AxiosPromise<T>
): Promise<T> => {
  const { data } = await request;

  return data;
};
