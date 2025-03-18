import { apiRouter } from "./apiRouter";

export default async function validateToken() {
  const res = await apiRouter.fetchGetAuth("validateJwt");
  if (res.status === 401 || !res.ok) {
    return false;
  }

  const { userId } = await res.json();
  return userId;
}
