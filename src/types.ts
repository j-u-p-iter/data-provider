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

export type RecordsList = Record[];

export type IdentifiersList = Identifier[];

export type Resource = string;

// We also return array of records to be able to handle all cases in one common consistent way.
// `data` property in response can also contain properties, different from `items`.
// For example, in case of GetListParams we get in data also total count of all items to be able
// to show pagination on client side.
export interface Response {
  success: boolean;
  message: string;
  data: {
    items: RecordsList;
    [key: string]: any;
  };
}

// GET LIST
export interface GetListParams {
  pagination: {
    limit: number;
    offset: number;
  };
}

// GET ONE
export interface GetOneParams {
  id: Identifier;
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
  id: Identifier;
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

  getMany: DataProviderMethod<GetManyParams, Response>;

  update: DataProviderMethod<UpdateParams, Response>;

  updateMany: DataProviderMethod<UpdateManyParams, Response>;

  create: DataProviderMethod<CreateParams, Response>;

  delete: DataProviderMethod<DeleteParams, Response>;

  deleteMany: DataProviderMethod<DeleteManyParams, Response>;
}

export type CreateDataProvider = (params: {
  host: string;
  protocol?: string;
  apiVersion?: string;
  port?: number | null;
}) => DataProvider;
