class ApiRouter {
  constructor() {}
  fetchRequest = async (method, path, data = null, token = false) => {
    try {
      const serverUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

      const credentialType = token ? "include" : "omit";

      const response = await fetch(`${serverUrl}/api/${path}`, {
        method,
        credentials: credentialType,
        headers: {
          "Content-Type": "application/json",
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
        // commented bc it sends response to wherever it's sent
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
  fetchPost = async (path, data) => {
    return await this.fetchRequest("POST", path, data, true);
  };

  fetchPut = async (path, data) => {
    return await this.fetchRequest("PUT", path, data, true);
  };

  fetchDelete = async (path) => {
    return await this.fetchRequest("DELETE", path, null, true);
  };

  fetchGet = async (path) => {
    return await this.fetchRequest("GET", path, null);
  };

  fetchGetAuth = async (path) => {
    return await this.fetchRequest("GET", path, null, true);
  };
}
export const apiRouter = new ApiRouter();
