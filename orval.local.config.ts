import { defineConfig } from "orval";

export default defineConfig({
  api: {
    output: {
      mode: "split",
      target: "app/api/generated",
      schemas: "app/api/generated/models",
      client: "react-query",
      mock: false,
      prettier: true,
      clean: true,
      override: {
        mutator: {
          path: "app/api/mutator/custom-instance.ts",
          name: "customInstance",
        },
        query: {
          useQuery: true,
          useInfinite: false,
          useInfiniteQueryParam: "pageParam",
          // Optionally set default query options
        },
      },
    },
    input: {
      target: "../back/swagger.json",
    },
  },
});
