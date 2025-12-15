import { apiFetch } from "./client";

export const login = (email, password) =>
  apiFetch(`/users/login?email=${email}&password=${password}`, {
    method: "POST",
  });

export const register = (data) =>
  apiFetch("/users/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
