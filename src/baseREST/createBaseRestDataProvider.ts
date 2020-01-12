import { makeUrl } from "@j.u.p.iter/node-utils";
import axios from "axios";

import { extractData } from "../helpers";

import { CreateBaseRESTDataProvider, Response } from "../types";

export const createBaseRestDataProvider: CreateBaseRESTDataProvider = ({
  host,
  port = null,
  protocol = "https",
  apiVersion = "v1"
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

    return extractData<Response>(axios.get(url));
  };

  // GET
  const getOne = (resource, params) => {
    const url = makeUrl({
      host,
      port,
      protocol,
      path: getPath([resource, params.id].join("/"))
    });

    return extractData<Response>(axios.get(url));
  };

  const getMany = (resource, params) => {
    const url = makeUrl({
      host,
      port,
      protocol,
      path: getPath(resource),
      queryObject: { id: params.ids }
    });

    return extractData<Response>(axios.get(url));
  };

  const update = (resource, params) => {
    const url = makeUrl({
      host,
      port,
      protocol,
      path: getPath([resource, params.id].join("/"))
    });

    return extractData<Response>(axios.put(url, params.data));
  };

  const updateMany = (resource, params) => {
    const url = makeUrl({
      host,
      port,
      protocol,
      path: getPath(resource),
      queryObject: { id: params.ids }
    });

    return extractData<Response>(axios.put(url, params.data));
  };

  // CREATE
  const create = (resource, params) => {
    const url = makeUrl({ host, port, protocol, path: getPath(resource) });

    return extractData<Response>(axios.post(url, params.data));
  };

  // DELETE
  const deleteOne = (resource, params) => {
    const url = makeUrl({
      host,
      port,
      protocol,
      path: getPath([resource, params.id].join("/"))
    });

    return extractData<Response>(axios.delete(url));
  };

  const deleteMany = (resource, params) => {
    const url = makeUrl({
      host,
      port,
      protocol,
      path: getPath(resource),
      queryObject: { id: params.ids }
    });

    return extractData<Response>(axios.delete(url));
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
