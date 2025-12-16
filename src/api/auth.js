import { apiFetch } from "./client";

export const login = (email, password) =>
  apiFetch("/users/login", {
    method: "POST",
    body: JSON.stringify({ email, password, name: "temp" }),
  });

export const register = (data) =>
  apiFetch("/users/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
