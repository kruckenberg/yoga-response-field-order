import { createServer } from "node:http";
import { createSchema, createYoga } from "graphql-yoga";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const yoga = createYoga({
  schema: createSchema({
    typeDefs: /* GraphQL */ `
      type Query {
        fieldOrder: StaggeredResolution!
      }

      type StaggeredResolution {
        first: Int!
        second: Int!
        third: Int!
        fourth: Int!
        fifth: Int!
      }
    `,
    resolvers: {
      Query: {
        fieldOrder: () => ({}),
      },
      StaggeredResolution: {
        first: async () => {
          await delay(40);
          return 1;
        },
        second: async () => {
          await delay(30);
          return 2;
        },
        third: async () => {
          await delay(20);
          return 3;
        },
        fourth: async () => {
          await delay(10);
          return 4;
        },
        fifth: async () => 5,
      },
    },
  }),
});

const server = createServer(yoga);

server.listen(4000, () => {
  console.info("Server is running on http://localhost:4000/graphql");
});
