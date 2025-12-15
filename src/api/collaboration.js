import { apiFetch } from "./client";

export const getSuggestions = () =>
  apiFetch("/collaboration/suggestions");

export const generateEmail = (payload) =>
  apiFetch("/collaboration/generate-email", {
    method: "POST",
    body: JSON.stringify(payload),
  });
