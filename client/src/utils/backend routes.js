class Route {
  constructor() {}
  fetchApi = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api`);
      const data = await res.json();
      console.log("API Response:", data);
    } catch (error) {
      console.error("Error fetching /api:", error);
    }
  };
}
export const Routing = new Route();
