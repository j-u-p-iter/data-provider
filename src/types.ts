export type DataProviderMethodWithOptionalParams<Params, Response> = (
  resource: string,
  params?: Params
) => Promise<Response>;

export type DataProviderMethod<Params, Response> = (
  resource: string,
  params: Params
) => Promise<Response>;

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

export interface CommonResponse<Data> {
  success: boolean;
  message: string;
  data: Data;
}

// GET LIST
export interface GetListResponse extends CommonResponse<RecordsList> {
  total: number;
}

export interface GetListParams {
  pagination: {
    limit: number;
    offset: number;
  };
}

// GET ONE
export interface GetOneResponse extends CommonResponse<Record> {}

export interface GetOneParams {
  id: Identifier;
}

// GET MANY
export interface GetManyResponse extends CommonResponse<RecordsList> {}

export interface GetManyParams {
  ids: IdentifiersList;
}

// UPDATE
export interface UpdateResponse extends CommonResponse<Record> {}

export interface UpdateParams {
  id: Identifier;
  data: Partial<Record>;
}

// UPDATE MANY
export interface UpdateManyResponse extends CommonResponse<Record[]> {}

export interface UpdateManyParams {
  ids: IdentifiersList;
  data: Partial<Record>;
}

// CREATE
export interface CreateResponse extends CommonResponse<Record> {}

export interface CreateParams {
  id: Identifier;
  data: RecordWithoutID;
}

// DELETE
export interface DeleteOneResponse extends CommonResponse<Record> {}

export interface DeleteParams {
  id: Identifier;
}

// DELETE MANY
export interface DeleteManyResponse extends CommonResponse<Record[]> {}

export interface DeleteManyParams {
  ids: IdentifiersList;
}

export interface DataProvider {
  getList: DataProviderMethodWithOptionalParams<GetListParams, GetListResponse>;

  getOne: DataProviderMethod<GetOneParams, GetOneResponse>;

  getMany: DataProviderMethod<GetManyParams, GetManyResponse>;

  update: DataProviderMethod<UpdateParams, UpdateResponse>;

  updateMany: DataProviderMethod<UpdateManyParams, UpdateManyResponse>;

  create: DataProviderMethod<CreateParams, CreateResponse>;

  delete: DataProviderMethod<DeleteParams, DeleteOneResponse>;

  deleteMany: DataProviderMethod<DeleteManyParams, DeleteManyResponse>;
}

export type CreateDataProvider = (params: {
  host: string;
  protocol?: string;
  apiVersion?: string;
  port?: number | null;
}) => DataProvider;
