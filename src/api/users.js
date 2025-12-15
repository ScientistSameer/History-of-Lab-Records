import { apiFetch } from "./client";

export const getProfile = () => apiFetch("/users/me");

export const updateProfile = (data) =>
  apiFetch("/users/me", {
    method: "PUT",
    body: JSON.stringify(data),
  });
