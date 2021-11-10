// We use ResultResponse instead of simply Response, to avoid shadowing
//
export type DataProviderMethodWithOptionalParams<Params, ResultResponse> = (
  resource: string,
  params?: Params
) => Promise<ResultResponse>;

export type DataProviderMethod<Params, ResultResponse> = (
  resource: string,
  params: Params
) => Promise<ResultResponse>;

export type Identifier = string;

export interface RecordWithoutID {
  [key: string]: any;
}

export interface Record extends RecordWithoutID {
  id: Identifier;
  [key: string]: any;
}

export type IdentifiersList = Identifier[];

export type Resource = string;

// GET LIST
export interface GetListParams {
  pagination: {
    limit: number;
    offset: number;
  };
  sorting?: {
    sortBy: string;
    sortDir: string;
  };
  fieldsNamesToFetch?: string[];
}

// GET ONE
export interface GetOneParams {
  id: Identifier;
  fieldsNamesToFetch?: string[];
}

// GET MANY
export interface GetManyParams {
  ids: IdentifiersList;
}

// UPDATE
export interface UpdateParams {
  id: Identifier;
  data: Partial<Record>;
}

// UPDATE MANY
export interface UpdateManyParams {
  ids: IdentifiersList;
  data: Partial<Record>;
}

// CREATE
export interface CreateParams {
  data: RecordWithoutID;
}

// DELETE
export interface DeleteParams {
  id: Identifier;
}

// DELETE MANY
export interface DeleteManyParams {
  ids: IdentifiersList;
}

export interface DataProvider {
  getList: DataProviderMethodWithOptionalParams<GetListParams, Response>;

  getOne: DataProviderMethod<GetOneParams, Response>;

  getMany?: DataProviderMethod<GetManyParams, Response>;

  update: DataProviderMethod<UpdateParams, Response>;

  updateMany?: DataProviderMethod<UpdateManyParams, Response>;

  create: DataProviderMethod<CreateParams, Response>;

  delete: DataProviderMethod<DeleteParams, Response>;

  deleteMany?: DataProviderMethod<DeleteManyParams, Response>;
}
export type Response = any;

export type GetMethod<R = any> = (url: string) => { request: Promise<R> };

export type PostMethod<T = any, R = any> = (
  url: string,
  data: T
) => { request: Promise<R> };

export type PutMethod<T = any, R = any> = (
  url: string,
  data: T
) => { request: Promise<R> };

export type DeleteMethod<R = any> = (url: string) => { request: Promise<R> };

interface Fetcher {
  get: GetMethod;
  post: PostMethod;
  put: PutMethod;
  delete: DeleteMethod;
}

export type CreateBaseRESTDataProvider = (params: {
  fetcher: Fetcher;
  host: string;
  protocol?: string;
  apiVersion?: string;
  port?: number | null;
}) => DataProvider;

export type CreateGraphQLDataProvider = (params: {
  dataSchema: { [key: string]: any };
  client: any;
}) => DataProvider;
