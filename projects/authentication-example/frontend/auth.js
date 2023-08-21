import { redirect } from "react-router-dom";

export const KEY_TOKEN = "token";
export const KEY_TOKEN_EXPIRATION = "token_expiration";

//export getAuthToken = () => {
export function getAuthToken() {
  const token = localStorage.getItem(KEY_TOKEN);

  if (!token) {
    return null;
  }

  const tokenDuration = getTokenDuration();
  console.log(tokenDuration);

  if (tokenDuration < 0) {
    return "EXPIRED";
  }

  return token;
}

export function tokenLoader() {
  return getAuthToken();
}

export function getTokenDuration() {
  const storedDate = localStorage.getItem(KEY_TOKEN_EXPIRATION);
  const expirationDate = new Date(storedDate);
  const now = new Date();
  const duration = expirationDate.getTime() - now.getTime();
  return duration;
}

/**
 * Route GUARD
 * @returns
 */
export function checkAuthLoader() {
  // this function will be added in the next lecture
  // make sure it looks like this in the end
  const token = getAuthToken();

  if (!token) {
    return redirect("/auth");
  }

  return null; // this is missing in the next lecture video and should be added by you
}

export function logout() {
  localStorage.removeItem(KEY_TOKEN);
  localStorage.removeItem(KEY_TOKEN_EXPIRATION);
}
