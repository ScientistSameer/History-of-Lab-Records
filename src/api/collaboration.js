// api/collaboration.js
import { apiFetch } from "./client";

export const getSuggestions = async () => {
  try {
    const res = await fetch("http://localhost:8001/collaboration/suggestions");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const sendEmail = async (payload) =>
  apiFetch("/collaboration/send-email", {
    method: "POST",
    body: JSON.stringify(payload),
  });
