import { fireEvent, render, waitForDomChange } from "@testing-library/react";
import gql from "graphql-tag";
import * as React from "react";
import { types } from "typed-graphqlify";

import { useApolloClient } from "@apollo/react-hooks";
import { MockedProvider } from "@apollo/react-testing";
import { createGraphQLDataProvider } from "./createGraphQLDataProvider";

const { useState, useMemo } = React;

describe("createGraphQLDataProvider", () => {
  let dataSchema;

  beforeAll(() => {
    dataSchema = {
      user: {
        id: types.string,
        name: types.string
      }
    };
  });

  describe("getList", () => {
    let users;
    let renderComponent;

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

      const mocks = [
        {
          request: {
            query: GET_USERS_QUERY
          },
          result: { data: { users } }
        }
      ];

      const TestComponent = () => {
        const [data, setData] = useState<any>({});
        const client = useApolloClient();

        const dataProvider = useMemo(() => {
          return createGraphQLDataProvider({
            dataSchema,
            client
          });
        }, []);

        const handleClick = async () => {
          const response = await dataProvider.getList("users", {
            fieldsNamesToFetch: ["id", "name"]
          });

          setData(response);
        };

        return (
          <div>
            <div data-testid="message">{data.message}</div>
            {data.success ? (
              <ul data-testid="data-list">
                {data.data.items.map(({ id, name }) => {
                  return (
                    <li key={id} data-testid="data-item">
                      <span data-testid="id">{id}</span>
                      <span data-testid="name">{name}</span>
                    </li>
                  );
                })}
              </ul>
            ) : null}
            <button data-testid="button" onClick={handleClick}>
              Click me
            </button>
          </div>
        );
      };

      renderComponent = () => {
        return render(
          <MockedProvider mocks={mocks} addTypename={false}>
            <TestComponent />
          </MockedProvider>
        );
      };
    });

    it("sends request and returns correct result", async () => {
      const { queryByTestId, queryAllByTestId, container } = renderComponent();

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

  describe("getOne", () => {
    let renderComponent;
    let user;

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

      const mocks = [
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

      const TestComponent = () => {
        const [data, setData] = useState<any>({});
        const client = useApolloClient();

        const dataProvider = useMemo(() => {
          return createGraphQLDataProvider({
            dataSchema,
            client
          });
        }, []);

        const handleClick = async () => {
          const response = await dataProvider.getOne("users", {
            id: "12345",
            fieldsNamesToFetch: ["id", "name"]
          });

          setData(response);
        };

        return (
          <div>
            <div data-testid="message">{data.message}</div>
            {data.success ? (
              <ul data-testid="data-list">
                {data.data.items.map(({ id, name }) => {
                  return (
                    <li key={id} data-testid="data-item">
                      <span data-testid="id">{id}</span>
                      <span data-testid="name">{name}</span>
                    </li>
                  );
                })}
              </ul>
            ) : null}
            <button data-testid="button" onClick={handleClick}>
              Click me
            </button>
          </div>
        );
      };

      renderComponent = () => {
        return render(
          <MockedProvider mocks={mocks} addTypename={false}>
            <TestComponent />
          </MockedProvider>
        );
      };
    });

    it("sends request and returns correct result", async () => {
      const { queryByTestId, container } = renderComponent();

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

  describe("update", () => {
    let renderComponent;
    let user;

    beforeAll(() => {
      user = {
        id: "1",
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

      const mocks = [
        {
          request: {
            query: UPDATE_USER_MUTATION,
            variables: {
              id: "12345",
              input: {
                name: "new name"
              }
            }
          },
          result: { data: { user } }
        }
      ];

      const TestComponent = () => {
        const [data, setData] = useState<any>({});
        const client = useApolloClient();

        const dataProvider = useMemo(() => {
          return createGraphQLDataProvider({
            dataSchema,
            client
          });
        }, []);

        const handleClick = async () => {
          const response = await dataProvider.update("users", {
            id: "12345",
            data: { name: "new name" },
            fieldsNamesToFetch: ["id", "name"]
          });

          setData(response);
        };

        return (
          <div>
            <div data-testid="message">{data.message}</div>
            {data.success ? (
              <ul data-testid="data-list">
                {data.data.items.map(({ id, name }) => {
                  return (
                    <li key={id} data-testid="data-item">
                      <span data-testid="id">{id}</span>
                      <span data-testid="name">{name}</span>
                    </li>
                  );
                })}
              </ul>
            ) : null}
            <button data-testid="button" onClick={handleClick}>
              Click me
            </button>
          </div>
        );
      };

      renderComponent = () => {
        return render(
          <MockedProvider mocks={mocks} addTypename={false}>
            <TestComponent />
          </MockedProvider>
        );
      };
    });

    it("sends request and returns correct result", async () => {
      const { queryByTestId, container } = renderComponent();

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

  describe("create", () => {
    let renderComponent;
    let user;

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

      const mocks = [
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

      const TestComponent = () => {
        const [data, setData] = useState<any>({});
        const client = useApolloClient();

        const dataProvider = useMemo(() => {
          return createGraphQLDataProvider({
            dataSchema,
            client
          });
        }, []);

        const handleClick = async () => {
          const response = await dataProvider.create("users", {
            data: { name: user.name },
            fieldsNamesToFetch: ["id", "name"]
          });

          setData(response);
        };

        return (
          <div>
            <div data-testid="message">{data.message}</div>
            {data.success ? (
              <ul data-testid="data-list">
                {data.data.items.map(({ id, name }) => {
                  return (
                    <li key={id} data-testid="data-item">
                      <span data-testid="id">{id}</span>
                      <span data-testid="name">{name}</span>
                    </li>
                  );
                })}
              </ul>
            ) : null}
            <button data-testid="button" onClick={handleClick}>
              Click me
            </button>
          </div>
        );
      };

      renderComponent = () => {
        return render(
          <MockedProvider mocks={mocks} addTypename={false}>
            <TestComponent />
          </MockedProvider>
        );
      };
    });

    it("sends request and returns correct result", async () => {
      const { queryByTestId, container } = renderComponent();

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

  describe("delete", () => {
    let renderComponent;
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

      const mocks = [
        {
          request: {
            query: DELETE_USER_MUTATION,
            variables: { id: user.id }
          },
          result: { data: { user } }
        }
      ];

      const TestComponent = () => {
        const [data, setData] = useState<any>({});
        const client = useApolloClient();

        const dataProvider = useMemo(() => {
          return createGraphQLDataProvider({
            dataSchema,
            client
          });
        }, []);

        const handleClick = async () => {
          const response = await dataProvider.delete("users", {
            id: user.id,
            fieldsNamesToFetch: ["id", "name"]
          });

          setData(response);
        };

        return (
          <div>
            <div data-testid="message">{data.message}</div>
            {data.success ? (
              <ul data-testid="data-list">
                {data.data.items.map(({ id, name }) => {
                  return (
                    <li key={id} data-testid="data-item">
                      <span data-testid="id">{id}</span>
                      <span data-testid="name">{name}</span>
                    </li>
                  );
                })}
              </ul>
            ) : null}
            <button data-testid="button" onClick={handleClick}>
              Click me
            </button>
          </div>
        );
      };

      renderComponent = () => {
        return render(
          <MockedProvider mocks={mocks} addTypename={false}>
            <TestComponent />
          </MockedProvider>
        );
      };
    });

    it("sends request and returns correct result", async () => {
      const { queryByTestId, container } = renderComponent();

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
