import { createServer } from "node:http";
import { createSchema, createYoga } from "graphql-yoga";

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
        first: async () => 1,
        second: () => 2,
        third: () => 3,
        fourth: () => 4,
        fifth: () => 5,
      },
    },
  }),
});

const server = createServer(yoga);

server.listen(4000, () => {
  console.info("Server is running on http://localhost:4000/graphql");
});
