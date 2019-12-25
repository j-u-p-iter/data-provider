import nock from "nock";
import { createBaseRestDataProvider } from "../.";
import { DataProvider } from "../types";

describe("createBaseRestDataProvider", () => {
  const fakeResponse = { id: "1" };
  const params = { id: "1" };
  const HOST = "super-site.com";
  const resource = "posts";

  let baseRestDataProvider: DataProvider;

  describe("with default params", () => {
    const baseUrl = `https://${HOST}`;
    const path = `/api/v1/${resource}`;
    const pathWithId = `/api/v1/${resource}/${params.id}`;

    beforeAll(() => {
      baseRestDataProvider = createBaseRestDataProvider({ host: HOST });
    });

    describe("getList", () => {
      describe("with default pagination", () => {
        beforeAll(() => {
          nock(baseUrl)
            .get(path)
            .query({ limit: 10, offset: 0 })
            .reply(200, { id: 1 });
        });

        it("sends request and returns correct result", async () => {
          const posts = await baseRestDataProvider.getList("posts");

          expect(posts).toEqual({ id: 1 });
        });
      });

      describe("with custom pagination", () => {
        beforeAll(() => {
          nock(baseUrl)
            .get(path)
            .query({ limit: 20, offset: 10 })
            .reply(200, { id: 1 });
        });

        it("sends request and returns correct result", async () => {
          const posts = await baseRestDataProvider.getList("posts", {
            pagination: { limit: 20, offset: 10 }
          });

          expect(posts).toEqual({ id: 1 });
        });
      });
    });

    describe("getOne", () => {
      beforeAll(() => {
        nock(baseUrl)
          .get(pathWithId)
          .reply(200, fakeResponse);
      });

      it("sends request and returns correct result", async () => {
        const post = await baseRestDataProvider.getOne("posts", params);

        expect(post).toEqual(fakeResponse);
      });
    });

    describe("getMany", () => {
      beforeAll(() => {
        nock(baseUrl)
          .get(path)
          .query({ id: ["1", "2"] })
          .reply(200, [{ id: "1" }, { id: "2" }]);
      });

      it("sends request and returns correct result", async () => {
        const posts = await baseRestDataProvider.getMany("posts", {
          ids: ["1", "2"]
        });

        expect(posts).toEqual([{ id: "1" }, { id: "2" }]);
      });
    });

    describe("update", () => {
      beforeAll(() => {
        nock(baseUrl)
          .put(pathWithId)
          .reply(200, { id: "1" });
      });

      it("sends request and returns correct result", async () => {
        const updatedPost = await baseRestDataProvider.update("posts", {
          id: "1",
          data: { title: "some title" }
        });

        expect(updatedPost).toEqual({ id: "1" });
      });
    });

    describe("updateMany", () => {
      beforeAll(() => {
        nock(baseUrl)
          .put(path)
          .query({ id: ["1", "2"] })
          .reply(200, [{ id: "1" }, { id: "2" }]);
      });

      it("sends request and returns correct result", async () => {
        const updatedPosts = await baseRestDataProvider.updateMany("posts", {
          ids: ["1", "2"],
          data: { title: "some title" }
        });

        expect(updatedPosts).toEqual([{ id: "1" }, { id: "2" }]);
      });
    });

    describe("create", () => {
      beforeAll(() => {
        nock(baseUrl)
          .post(path)
          .reply(200, { id: "1" });
      });

      it("sends request and returns correct result", async () => {
        const createdPost = await baseRestDataProvider.create("posts", {
          data: { title: "some title" }
        });

        expect(createdPost).toEqual({ id: "1" });
      });
    });

    describe("create", () => {
      beforeAll(() => {
        nock(baseUrl)
          .post(path)
          .reply(200, { id: "1" });
      });

      it("sends request and returns correct result", async () => {
        const createdPost = await baseRestDataProvider.create("posts", {
          data: { title: "some title" }
        });

        expect(createdPost).toEqual({ id: "1" });
      });
    });

    describe("delete", () => {
      beforeAll(() => {
        nock(baseUrl)
          .delete(pathWithId)
          .reply(200, { id: "1" });
      });

      it("sends request and returns correct result", async () => {
        const deletedPost = await baseRestDataProvider.delete("posts", {
          id: "1"
        });

        expect(deletedPost).toEqual({ id: "1" });
      });
    });

    describe("deleteMany", () => {
      beforeAll(() => {
        nock(baseUrl)
          .delete(path)
          .query({ id: ["1", "2"] })
          .reply(200, [{ id: "1" }, { id: "2" }]);
      });

      it("sends request and returns correct result", async () => {
        const deletedPosts = await baseRestDataProvider.deleteMany("posts", {
          ids: ["1", "2"]
        });

        expect(deletedPosts).toEqual([{ id: "1" }, { id: "2" }]);
      });
    });
  });

  describe("with custom params", () => {
    const baseUrl = `http://${HOST}:3000`;
    const path = `/api/v2/${resource}`;
    const pathWithId = `/api/v2/${resource}/${params.id}`;

    beforeAll(() => {
      baseRestDataProvider = createBaseRestDataProvider({
        protocol: "http",
        host: HOST,
        apiVersion: "v2",
        port: 3000
      });
    });

    describe("getList", () => {
      describe("with default pagination", () => {
        beforeAll(() => {
          nock(baseUrl)
            .get(path)
            .query({ limit: 10, offset: 0 })
            .reply(200, { id: 1 });
        });

        it("sends request and returns correct result", async () => {
          const posts = await baseRestDataProvider.getList("posts");

          expect(posts).toEqual({ id: 1 });
        });
      });

      describe("with custom pagination", () => {
        beforeAll(() => {
          nock(baseUrl)
            .get(path)
            .query({ limit: 20, offset: 10 })
            .reply(200, { id: 1 });
        });

        it("sends request and returns correct result", async () => {
          const posts = await baseRestDataProvider.getList("posts", {
            pagination: { limit: 20, offset: 10 }
          });

          expect(posts).toEqual({ id: 1 });
        });
      });
    });

    describe("getOne", () => {
      beforeAll(() => {
        nock(baseUrl)
          .get(pathWithId)
          .reply(200, fakeResponse);
      });

      it("sends request and returns correct result", async () => {
        const post = await baseRestDataProvider.getOne("posts", params);

        expect(post).toEqual(fakeResponse);
      });
    });

    describe("getMany", () => {
      beforeAll(() => {
        nock(baseUrl)
          .get(path)
          .query({ id: ["1", "2"] })
          .reply(200, [{ id: "1" }, { id: "2" }]);
      });

      it("sends request and returns correct result", async () => {
        const posts = await baseRestDataProvider.getMany("posts", {
          ids: ["1", "2"]
        });

        expect(posts).toEqual([{ id: "1" }, { id: "2" }]);
      });
    });

    describe("update", () => {
      beforeAll(() => {
        nock(baseUrl)
          .put(pathWithId)
          .reply(200, { id: "1" });
      });

      it("sends request and returns correct result", async () => {
        const updatedPost = await baseRestDataProvider.update("posts", {
          id: "1",
          data: { title: "some title" }
        });

        expect(updatedPost).toEqual({ id: "1" });
      });
    });

    describe("updateMany", () => {
      beforeAll(() => {
        nock(baseUrl)
          .put(path)
          .query({ id: ["1", "2"] })
          .reply(200, [{ id: "1" }, { id: "2" }]);
      });

      it("sends request and returns correct result", async () => {
        const updatedPosts = await baseRestDataProvider.updateMany("posts", {
          ids: ["1", "2"],
          data: { title: "some title" }
        });

        expect(updatedPosts).toEqual([{ id: "1" }, { id: "2" }]);
      });
    });

    describe("create", () => {
      beforeAll(() => {
        nock(baseUrl)
          .post(path)
          .reply(200, { id: "1" });
      });

      it("sends request and returns correct result", async () => {
        const createdPost = await baseRestDataProvider.create("posts", {
          data: { title: "some title" }
        });

        expect(createdPost).toEqual({ id: "1" });
      });
    });

    describe("create", () => {
      beforeAll(() => {
        nock(baseUrl)
          .post(path)
          .reply(200, { id: "1" });
      });

      it("sends request and returns correct result", async () => {
        const createdPost = await baseRestDataProvider.create("posts", {
          data: { title: "some title" }
        });

        expect(createdPost).toEqual({ id: "1" });
      });
    });

    describe("delete", () => {
      beforeAll(() => {
        nock(baseUrl)
          .delete(pathWithId)
          .reply(200, { id: "1" });
      });

      it("sends request and returns correct result", async () => {
        const deletedPost = await baseRestDataProvider.delete("posts", {
          id: "1"
        });

        expect(deletedPost).toEqual({ id: "1" });
      });
    });

    describe("deleteMany", () => {
      beforeAll(() => {
        nock(baseUrl)
          .delete(path)
          .query({ id: ["1", "2"] })
          .reply(200, [{ id: "1" }, { id: "2" }]);
      });

      it("sends request and returns correct result", async () => {
        const deletedPosts = await baseRestDataProvider.deleteMany("posts", {
          ids: ["1", "2"]
        });

        expect(deletedPosts).toEqual([{ id: "1" }, { id: "2" }]);
      });
    });
  });
});
