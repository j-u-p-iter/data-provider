import gql from "graphql-tag";
import pluralize from "pluralize";
import { mutation, params, query } from "typed-graphqlify";

const capitalizeFirstCharacter = (data: string): string =>
  `${data[0].toUpperCase()}${data.slice(1)}`;

const prepareResponse = (resource, { data }) => {
  return {
    success: true,
    message: `${resource} has been loaded with success`,
    data: {
      items: Array.isArray(data[resource]) ? data[resource] : [data[resource]]
    }
  };
};

export const createGraphQLDataProvider = ({ dataSchema, client }) => {
  const prepareParamsToFetch = (resource, fieldsNames) => {
    return fieldsNames.reduce((totalResult, currentFieldName) => {
      totalResult[currentFieldName] = dataSchema[resource][currentFieldName];

      return totalResult;
    }, {});
  };

  const getList = async (resource, { fieldsNamesToFetch }) => {
    const paramsToFetch = prepareParamsToFetch(
      pluralize.singular(resource),
      fieldsNamesToFetch
    );

    const getListOfSomeResourcesQuery = query(
      `get${capitalizeFirstCharacter(resource)}`,
      {
        [resource]: paramsToFetch
      }
    );

    const data = await client.query({
      query: gql`
        ${getListOfSomeResourcesQuery}
      `
    });

    return prepareResponse(resource, data);
  };

  const getOne = async (resource, { id, fieldsNamesToFetch }) => {
    const paramsToFetch = prepareParamsToFetch(
      pluralize.singular(resource),
      fieldsNamesToFetch
    );

    const getSomeResourceQuery = query(
      `get${capitalizeFirstCharacter(pluralize.singular(resource))}`,
      {
        [pluralize.singular(resource)]: params({ id }, paramsToFetch)
      }
    );

    const data = await client.query({
      query: gql`
        ${getSomeResourceQuery}
      `,
      variables: { id }
    });

    return prepareResponse(pluralize.singular(resource), data);
  };

  const update = async (resource, { id, data, fieldsNamesToFetch }) => {
    const paramsToFetch = prepareParamsToFetch(
      pluralize.singular(resource),
      fieldsNamesToFetch
    );

    const getSomeResourceQuery = mutation(
      `update${capitalizeFirstCharacter(pluralize.singular(resource))}`,
      params(
        {
          $input: `Add${capitalizeFirstCharacter(
            pluralize.singular(resource)
          )}Input!`
        },
        {
          [`update${capitalizeFirstCharacter(
            pluralize.singular(resource)
          )}`]: params({ input: "$input" }, paramsToFetch)
        }
      )
    );

    const response = await client.mutate({
      mutation: gql`
        ${getSomeResourceQuery}
      `,
      variables: { input: { id, ...data } }
    });

    return prepareResponse(pluralize.singular(resource), response);
  };

  return {
    getList,
    getOne,
    update
  };
};
