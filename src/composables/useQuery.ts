import { reactive } from "vue";
import hash from "object-hash";

export function useQuery(store, routePath) {
  const query = reactive({});
  const path = routePath;

  const updateQuery = (routeQuery, routePath) => {
    if (path !== routePath) return;
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

    query.startDate = copyQuery.start;
    query.endDate = copyQuery.end;

    // TODO: is this really needed? is that key doing anything?
    query.hash = hash(copyQuery);

    console.log(query);
  };

  return {
    query,
    updateQuery,
  };
}
