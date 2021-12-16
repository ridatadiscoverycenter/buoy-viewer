import { reactive } from "vue";

export function useQuery(store) {
  const query = reactive({});

  const updateQuery = (routeQuery) => {
    const copyQuery = { ...routeQuery };
    const vars = ["variables", "start", "end", "ids"];
    vars.forEach((v) => {
      if (routeQuery[v]) {
        copyQuery[v] = ["variables", "ids"].includes(v)
          ? routeQuery[v].split(",")
          : routeQuery[v];
      } else {
        throw new Error(`Missing required query parameter: ${v}`);
      }
    });

    query.variables = store.variables.filter((v) =>
      copyQuery.variables.includes(v.name)
    );
    query.coordinates = store.coordinates.filter((c) =>
      copyQuery.ids.includes(c.buoyId)
    );

    query.startDate = new Date(copyQuery.start).toLocaleDateString("sv");
    query.endDate = new Date(copyQuery.end).toLocaleDateString("sv");

    console.log(query);
  };

  return {
    query,
    updateQuery,
  };
}
