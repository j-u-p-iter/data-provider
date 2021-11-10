import { Response } from "./types";

export const extractData = async <T = any>(
  request: Promise<Response>
): Promise<T> => {
  const { data } = await request;

  return data;
};
