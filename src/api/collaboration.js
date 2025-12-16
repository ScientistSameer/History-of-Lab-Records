import { apiFetch } from "./client";

export const getSuggestions = () =>
  apiFetch("/collaboration");

export const generateEmail = (payload) =>
  apiFetch("/collaboration/generate-email", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const getEmails = () =>
  apiFetch("/collaboration/emails");
