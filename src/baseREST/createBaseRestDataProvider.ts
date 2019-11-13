import { makeUrl } from "@j.u.p.iter/node-utils";
import axios from "axios";

import { extractData } from "../helpers";

import {
  CreateDataProvider,
  CreateResponse,
  DeleteManyResponse,
  DeleteOneResponse,
  GetListResponse,
  GetManyResponse,
  GetOneResponse,
  UpdateManyResponse,
  UpdateResponse
} from "../types";

export const createBaseRestDataProvider: CreateDataProvider = ({
  host,
  protocol = "https",
  apiVersion = "v1"
}) => {
  const getPath = basePath => `api/${apiVersion}/${basePath}`;

  const getList = (
    resource,
    { pagination: { limit = 10, offset = 0 } = {} } = {}
  ) => {
    const url = makeUrl({
      host,
      protocol,
      path: getPath(resource),
      queryObject: { limit, offset }
    });

    return extractData<GetListResponse>(axios.get(url));
  };

  // GET
  const getOne = (resource, params) => {
    const url = makeUrl({
      host,
      protocol,
      path: getPath([resource, params.id].join("/"))
    });

    return extractData<GetOneResponse>(axios.get(url));
  };

  const getMany = (resource, params) => {
    const url = makeUrl({
      host,
      protocol,
      path: getPath(resource),
      queryObject: { id: params.ids }
    });

    return extractData<GetManyResponse>(axios.get(url));
  };

  const update = (resource, params) => {
    const url = makeUrl({
      host,
      protocol,
      path: getPath([resource, params.id].join("/"))
    });

    return extractData<UpdateResponse>(axios.put(url, params.data));
  };

  const updateMany = (resource, params) => {
    const url = makeUrl({
      host,
      protocol,
      path: getPath(resource),
      queryObject: { id: params.ids }
    });

    return extractData<UpdateManyResponse>(axios.put(url, params.data));
  };

  // CREATE
  const create = (resource, params) => {
    const url = makeUrl({ host, protocol, path: getPath(resource) });

    return extractData<CreateResponse>(axios.post(url, params.data));
  };

  // DELETE
  const deleteOne = (resource, params) => {
    const url = makeUrl({
      host,
      protocol,
      path: getPath([resource, params.id].join("/"))
    });

    return extractData<DeleteOneResponse>(axios.delete(url));
  };

  const deleteMany = (resource, params) => {
    const url = makeUrl({
      host,
      protocol,
      path: getPath(resource),
      queryObject: { id: params.ids }
    });

    return extractData<DeleteManyResponse>(axios.delete(url));
  };

  return {
    getList,
    getOne,
    getMany,
    update,
    updateMany,
    create,
    deleteMany,
    delete: deleteOne
  };
};
