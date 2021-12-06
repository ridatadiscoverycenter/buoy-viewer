import { reactive } from "vue";

export function useQuery() {
  const query = reactive({})

  const updateQuery = (routeQuery) => {
    const vars = ["variables", "start", "end", "ids"]
    vars.forEach(v => {
      if (routeQuery[v]) {
        query[v] = routeQuery[v];
      } else {
        throw new Error(`Missing required query parameter: ${v}`)
      }
    })
  }

  return {
    query,
    updateQuery
  }
}
