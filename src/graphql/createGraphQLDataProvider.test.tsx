import {
  cleanup,
  fireEvent,
  render,
  waitForDomChange
} from "@testing-library/react";
import gql from "graphql-tag";
import * as React from "react";
import { types } from "typed-graphqlify";

import { useApolloClient } from "@apollo/react-hooks";
import { MockedProvider } from "@apollo/react-testing";
import { createGraphQLDataProvider } from "./createGraphQLDataProvider";

const { useState } = React;

describe("createGraphQLDataProvider", () => {
  let dataSchema;
  let renderComponent;

  beforeAll(() => {
    dataSchema = {
      user: {
        id: types.string,
        name: types.string
      }
    };
  });

  afterEach(() => {
    cleanup();
  });

  describe("getList", () => {
    beforeAll(() => {
      const DataProvider: React.FC<any> = ({
        dataSchema: dataSchemaFromProps,
        runAction
      }) => {
        const client = useApolloClient();

        const dataProvider = createGraphQLDataProvider({
          dataSchema: dataSchemaFromProps,
          client
        });

        const handleClick = async callback => {
          const response = await runAction(dataProvider);

          callback(response);
        };

        return <TestComponent onClick={handleClick} />;
      };

      const TestComponent: React.FC<any> = ({ onClick }) => {
        const [data, setData] = useState<any>({});

        return (
          <div>
            <div data-testid="message">{data.message}</div>
            {data.success ? (
              <ul data-testid="data-list">
                {data.data.items.map(({ id, name }) => {
                  return (
                    <li key={id || name} data-testid="data-item">
                      <span data-testid="id">{id}</span>
                      <span data-testid="name">{name}</span>
                    </li>
                  );
                })}
              </ul>
            ) : null}
            <button data-testid="button" onClick={() => onClick(setData)}>
              Click me
            </button>
          </div>
        );
      };

      renderComponent = ({
        dataSchema: dataSchemaFromProps,
        runAction,
        mocks
      }) => {
        return render(
          <MockedProvider mocks={mocks} addTypename={false}>
            <DataProvider
              dataSchema={dataSchemaFromProps}
              runAction={runAction}
            />
          </MockedProvider>
        );
      };
    });

    describe("with fieldsNamesToFetch", () => {
      let mocks;
      let users;

      beforeAll(() => {
        users = [
          {
            name: "some name"
          },
          {
            name: "one more name"
          }
        ];

        const GET_USERS_QUERY = gql`
          query getUsers {
            users {
              name
            }
          }
        `;

        mocks = [
          {
            request: {
              query: GET_USERS_QUERY
            },
            result: { data: { users } }
          }
        ];
      });

      it("sends request and returns correct result", async () => {
        const runAction = dataProvider =>
          dataProvider.getList("users", { fieldsNamesToFetch: ["name"] });

        const { queryByTestId, queryAllByTestId, container } = renderComponent({
          dataSchema,
          runAction,
          mocks
        });

        const button = queryByTestId("button");

        expect(queryByTestId("data-list")).toBe(null);

        fireEvent.click(button);

        await waitForDomChange({ container });

        expect(queryAllByTestId("id")[0].textContent).toBe("");
        expect(queryAllByTestId("name")[0].textContent).toBe(users[0].name);

        expect(queryAllByTestId("id")[1].textContent).toBe("");
        expect(queryAllByTestId("name")[1].textContent).toBe(users[1].name);

        expect(queryByTestId("message").textContent).toBe(
          "users has been loaded with success"
        );
      });
    });

    describe("without fieldsNamesToFetch", () => {
      let mocks;
      let users;

      beforeAll(() => {
        users = [
          {
            id: "1",
            name: "some name"
          },
          {
            id: "2",
            name: "one more name"
          }
        ];

        const GET_USERS_QUERY = gql`
          query getUsers {
            users {
              id
              name
            }
          }
        `;

        mocks = [
          {
            request: {
              query: GET_USERS_QUERY
            },
            result: { data: { users } }
          }
        ];
      });

      it("sends request and returns correct result", async () => {
        const runAction = dataProvider => dataProvider.getList("users");

        const { queryByTestId, queryAllByTestId, container } = renderComponent({
          dataSchema,
          runAction,
          mocks
        });

        const button = queryByTestId("button");

        expect(queryByTestId("data-list")).toBe(null);

        fireEvent.click(button);

        await waitForDomChange({ container });

        expect(queryAllByTestId("id")[0].textContent).toBe(users[0].id);
        expect(queryAllByTestId("name")[0].textContent).toBe(users[0].name);

        expect(queryAllByTestId("id")[1].textContent).toBe(users[1].id);
        expect(queryAllByTestId("name")[1].textContent).toBe(users[1].name);

        expect(queryByTestId("message").textContent).toBe(
          "users has been loaded with success"
        );
      });
    });
  });

  describe("getOne", () => {
    let user;
    let mocks;

    describe("with fieldsNamesToFetch", () => {
      beforeAll(() => {
        user = {
          id: "12345",
          name: "some name"
        };

        const GET_USER_QUERY = gql`
          query getUser {
            user(id: 12345) {
              name
            }
          }
        `;

        mocks = [
          {
            request: {
              query: GET_USER_QUERY,
              variables: {
                id: user.id
              }
            },
            result: { data: { user: { name: user.name } } }
          }
        ];
      });

      it("sends request and returns correct result", async () => {
        const runAction = dataProvider =>
          dataProvider.getOne("users", {
            id: user.id,
            fieldsNamesToFetch: ["name"]
          });

        const { queryByTestId, container } = renderComponent({
          dataSchema,
          runAction,
          mocks
        });

        const button = queryByTestId("button");

        expect(queryByTestId("data-list")).toBe(null);

        fireEvent.click(button);

        await waitForDomChange({ container });

        expect(queryByTestId("id").textContent).toBe("");
        expect(queryByTestId("name").textContent).toBe(user.name);

        expect(queryByTestId("message").textContent).toBe(
          "user has been loaded with success"
        );
      });
    });

    describe("without fieldsNamesToFetch", () => {
      beforeAll(() => {
        user = {
          id: "1",
          name: "some name"
        };

        const GET_USER_QUERY = gql`
          query getUser {
            user(id: 12345) {
              id
              name
            }
          }
        `;

        mocks = [
          {
            request: {
              query: GET_USER_QUERY,
              variables: {
                id: "12345"
              }
            },
            result: { data: { user } }
          }
        ];
      });

      it("sends request and returns correct result", async () => {
        const runAction = dataProvider =>
          dataProvider.getOne("users", { id: "12345" });

        const { queryByTestId, container } = renderComponent({
          dataSchema,
          runAction,
          mocks
        });

        const button = queryByTestId("button");

        expect(queryByTestId("data-list")).toBe(null);

        fireEvent.click(button);

        await waitForDomChange({ container });

        expect(queryByTestId("id").textContent).toBe(user.id);
        expect(queryByTestId("name").textContent).toBe(user.name);

        expect(queryByTestId("message").textContent).toBe(
          "user has been loaded with success"
        );
      });
    });
  });

  describe("update", () => {
    describe("with fieldsNamesToFetch", () => {
      let user;
      let mocks;
      let newName;

      beforeAll(() => {
        newName = "new name";
        user = {
          id: "12345",
          name: "some name"
        };

        const UPDATE_USER_MUTATION = gql`
          mutation updateUser($id: ID!, $input: UpdateUserInput!) {
            updateUser(id: $id, input: $input) {
              id
            }
          }
        `;

        mocks = [
          {
            request: {
              query: UPDATE_USER_MUTATION,
              variables: {
                id: user.id,
                input: {
                  name: newName
                }
              }
            },
            result: { data: { user: { id: user.id } } }
          }
        ];
      });

      it("sends request and returns correct result", async () => {
        const runAction = dataProvider =>
          dataProvider.update("users", {
            id: user.id,
            data: { name: newName },
            fieldsNamesToFetch: ["id"]
          });

        const { queryByTestId, container } = renderComponent({
          mocks,
          dataSchema,
          runAction
        });

        const button = queryByTestId("button");

        expect(queryByTestId("data-list")).toBe(null);

        fireEvent.click(button);

        await waitForDomChange({ container });

        expect(queryByTestId("id").textContent).toBe(user.id);
        expect(queryByTestId("name").textContent).toBe("");

        expect(queryByTestId("message").textContent).toBe(
          "user has been loaded with success"
        );
      });
    });

    describe("without fieldsNamesToFetch", () => {
      let user;
      let mocks;
      let newName;

      beforeAll(() => {
        newName = "new name";
        user = {
          id: "12345",
          name: "some name"
        };

        const UPDATE_USER_MUTATION = gql`
          mutation updateUser($id: ID!, $input: UpdateUserInput!) {
            updateUser(id: $id, input: $input) {
              id
              name
            }
          }
        `;

        mocks = [
          {
            request: {
              query: UPDATE_USER_MUTATION,
              variables: {
                id: user.id,
                input: {
                  name: newName
                }
              }
            },
            result: { data: { user } }
          }
        ];
      });

      it("sends request and returns correct result", async () => {
        const runAction = dataProvider =>
          dataProvider.update("users", {
            id: user.id,
            data: { name: newName }
          });

        const { queryByTestId, container } = renderComponent({
          mocks,
          dataSchema,
          runAction
        });

        const button = queryByTestId("button");

        expect(queryByTestId("data-list")).toBe(null);

        fireEvent.click(button);

        await waitForDomChange({ container });

        expect(queryByTestId("id").textContent).toBe(user.id);
        expect(queryByTestId("name").textContent).toBe(user.name);

        expect(queryByTestId("message").textContent).toBe(
          "user has been loaded with success"
        );
      });
    });
  });

  describe("create", () => {
    describe("with fieldsNamesToFetch", () => {
      let user;
      let mocks;

      beforeAll(() => {
        user = {
          name: "some name"
        };

        const CREATE_USER_MUTATION = gql`
          mutation createUser($input: CreateUserInput!) {
            createUser(input: $input) {
              name
            }
          }
        `;

        mocks = [
          {
            request: {
              query: CREATE_USER_MUTATION,
              variables: {
                input: { name: user.name }
              }
            },
            result: { data: { user: { name: user.name } } }
          }
        ];
      });

      it("sends request and returns correct result", async () => {
        const runAction = async dataProvider => {
          return await dataProvider.create("users", {
            data: { name: user.name },
            fieldsNamesToFetch: ["name"]
          });
        };

        const { queryByTestId, container } = renderComponent({
          runAction,
          mocks,
          dataSchema
        });

        const button = queryByTestId("button");

        expect(queryByTestId("data-list")).toBe(null);

        fireEvent.click(button);

        await waitForDomChange({ container });

        expect(queryByTestId("id").textContent).toBe("");
        expect(queryByTestId("name").textContent).toBe(user.name);

        expect(queryByTestId("message").textContent).toBe(
          "user has been loaded with success"
        );
      });
    });

    describe("without fieldsNamesToFetch", () => {
      let user;
      let mocks;

      beforeAll(() => {
        user = {
          id: "1",
          name: "some name"
        };

        const CREATE_USER_MUTATION = gql`
          mutation createUser($input: CreateUserInput!) {
            createUser(input: $input) {
              id
              name
            }
          }
        `;

        mocks = [
          {
            request: {
              query: CREATE_USER_MUTATION,
              variables: {
                input: { name: user.name }
              }
            },
            result: { data: { user } }
          }
        ];
      });

      it("sends request and returns correct result", async () => {
        const runAction = async dataProvider => {
          return await dataProvider.create("users", {
            data: { name: user.name }
          });
        };

        const { queryByTestId, container } = renderComponent({
          runAction,
          mocks,
          dataSchema
        });

        const button = queryByTestId("button");

        expect(queryByTestId("data-list")).toBe(null);

        fireEvent.click(button);

        await waitForDomChange({ container });

        expect(queryByTestId("id").textContent).toBe(user.id);
        expect(queryByTestId("name").textContent).toBe(user.name);

        expect(queryByTestId("message").textContent).toBe(
          "user has been loaded with success"
        );
      });
    });
  });

  describe("delete", () => {
    describe("with fieldsNamesToFetch", () => {
      let mocks;
      let user;

      beforeAll(() => {
        user = {
          id: "1",
          name: "some name"
        };

        const DELETE_USER_MUTATION = gql`
          mutation deleteUser($id: ID!) {
            deleteUser(id: $id) {
              id
            }
          }
        `;

        mocks = [
          {
            request: {
              query: DELETE_USER_MUTATION,
              variables: { id: user.id }
            },
            result: { data: { user: { id: user.id } } }
          }
        ];
      });

      it("sends request and returns correct result", async () => {
        const runAction = dataProvider =>
          dataProvider.delete("users", {
            id: user.id,
            fieldsNamesToFetch: ["id"]
          });
        const { queryByTestId, container } = renderComponent({
          dataSchema,
          mocks,
          runAction
        });

        const button = queryByTestId("button");

        expect(queryByTestId("data-list")).toBe(null);

        fireEvent.click(button);

        await waitForDomChange({ container });

        expect(queryByTestId("id").textContent).toBe(user.id);
        expect(queryByTestId("name").textContent).toBe("");

        expect(queryByTestId("message").textContent).toBe(
          "user has been loaded with success"
        );
      });
    });

    describe("without fieldsNamesToFetch", () => {
      let mocks;
      let user;

      beforeAll(() => {
        user = {
          id: "1",
          name: "some name"
        };

        const DELETE_USER_MUTATION = gql`
          mutation deleteUser($id: ID!) {
            deleteUser(id: $id) {
              id
              name
            }
          }
        `;

        mocks = [
          {
            request: {
              query: DELETE_USER_MUTATION,
              variables: { id: user.id }
            },
            result: { data: { user } }
          }
        ];
      });

      it("sends request and returns correct result", async () => {
        const runAction = dataProvider =>
          dataProvider.delete("users", { id: user.id });
        const { queryByTestId, container } = renderComponent({
          dataSchema,
          mocks,
          runAction
        });

        const button = queryByTestId("button");

        expect(queryByTestId("data-list")).toBe(null);

        fireEvent.click(button);

        await waitForDomChange({ container });

        expect(queryByTestId("id").textContent).toBe(user.id);
        expect(queryByTestId("name").textContent).toBe(user.name);

        expect(queryByTestId("message").textContent).toBe(
          "user has been loaded with success"
        );
      });
    });
  });
});
