// src/api/collaboration.js

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

// ✅ UPDATED: Accept custom subject and body
export const sendEmail = async (payload) =>
  apiFetch("/collaboration/send-email", {
    method: "POST",
    body: JSON.stringify({
      to_lab_id: payload.to_lab_id,
      subject: payload.subject,   // ✅ Custom subject
      body: payload.body          // ✅ Custom body
    }),
  });