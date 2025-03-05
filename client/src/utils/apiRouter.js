class ApiRouter {
  constructor() {}
  fetchRequest = async (method, path, data = null, token = null) => {
    try {
      const serverUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const response = await fetch(`${serverUrl}/api/${path}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }), // Add token if provided
        },
        body: data ? JSON.stringify(data) : null,
      });

      if (!response.ok) {
        console.error(
          "there was an error\n",
          response.status,
          "\n",
          response.statusText
        );
        // throw new Error(
        //   `Request failed: ${response.status} ${response.statusText}`
        // );
      }

      return response;
    } catch (error) {
      console.error(`fetch${method} error:`, error);
      return null;
    }
  };
  fetchPost = async (path, data, token = null) => {
    return await this.fetchRequest("POST", path, data, token);
  };

  fetchPut = async (path, data, token) => {
    return await this.fetchRequest("PUT", path, data, token);
  };

  fetchDelete = async (path, token) => {
    return await this.fetchRequest("DELETE", path, null, token);
  };

  fetchGet = async (path) => {
    return await this.fetchRequest("GET", path);
  };

  fetchGetAuth = async (path, token) => {
    return await this.fetchRequest("GET", path, null, token);
  };
}
export const apiRouter = new ApiRouter();
