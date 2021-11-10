import { makeUrl } from "@j.u.p.iter/node-utils";
import { extractData } from '../helpers';

import { CreateBaseRESTDataProvider } from "../types";

export const createBaseRestDataProvider: CreateBaseRESTDataProvider = ({
  fetcher,
  host,
  port = null,
  protocol = "https",
  apiVersion = "v1",
}) => {
  const getPath = basePath => `api/${apiVersion}/${basePath}`;

  const getList = (
    resource,
    {
      sorting: { sortBy = "", sortDir = "" } = {},
      pagination: { limit = 10, offset = 0 } = {}
    } = {}
  ) => {
    const queryObject: {
      limit: number;
      offset: number;
      sortBy?: string;
      sortDir?: string;
    } = { limit, offset };

    if (sortBy) {
      queryObject.sortBy = sortBy;
    }

    if (sortDir) {
      queryObject.sortDir = sortDir;
    }

    const url = makeUrl({
      host,
      port,
      protocol,
      path: getPath(resource),
      queryObject
    });

    return extractData<Response>(fetcher.get(url).request);
  };

  // GET
  const getOne = (resource, params) => {
    const url = makeUrl({
      host,
      port,
      protocol,
      path: getPath([resource, params.id].join("/"))
    });

    return extractData<Response>(fetcher.get(url).request);
  };

  const getMany = (resource, params) => {
    const url = makeUrl({
      host,
      port,
      protocol,
      path: getPath(resource),
      queryObject: { id: params.ids }
    });

    return extractData<Response>(fetcher.get(url).request);
  };

  const update = (resource, params) => {
    const url = makeUrl({
      host,
      port,
      protocol,
      path: getPath([resource, params.id].join("/"))
    });

    return extractData<Response>(fetcher.put(url, params.data).request);
  };

  const updateMany = (resource, params) => {
    const url = makeUrl({
      host,
      port,
      protocol,
      path: getPath(resource),
      queryObject: { id: params.ids }
    });

    return extractData<Response>(fetcher.put(url, params.data).request);
  };

  // CREATE
  const create = (resource, params) => {
    const url = makeUrl({ host, port, protocol, path: getPath(resource) });

    return extractData<Response>(fetcher.post(url, params.data).request);
  };

  // DELETE
  const deleteOne = (resource, params) => {
    const url = makeUrl({
      host,
      port,
      protocol,
      path: getPath([resource, params.id].join("/"))
    });

    return extractData<Response>(fetcher.delete(url).request);
  };

  const deleteMany = (resource, params) => {
    const url = makeUrl({
      host,
      port,
      protocol,
      path: getPath(resource),
      queryObject: { id: params.ids }
    });

    return extractData<Response>(fetcher.delete(url).request);
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
