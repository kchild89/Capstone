import { apiRouter } from "./apiRouter";

export default async function validateToken() {
  const res = await apiRouter.fetchGetAuth("validateJwt");
  if (res.status === 401 || !res.ok) {
    return false;
  }
  return true; // return true if it worked/wasn't denied
}
