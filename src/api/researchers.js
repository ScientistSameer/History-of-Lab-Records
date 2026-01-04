// api/researchers.js
import { apiFetch } from "./client";

// Fetch all researchers
export const getResearchers = () => apiFetch("/researchers");

// Fetch researchers summary (total per lab, etc.)
export const getResearchersSummary = () => apiFetch("/researchers/summary");

// Create a new researcher
export const createResearcher = (researcherData) =>
  apiFetch("/researchers", { method: "POST", body: JSON.stringify(researcherData) });

// Update an existing researcher by ID
export const updateResearcher = (id, researcherData) =>
  apiFetch(`/researchers/${id}`, { method: "PUT", body: JSON.stringify(researcherData) });

// Delete a researcher by ID
export const deleteResearcher = (id) =>
  apiFetch(`/researchers/${id}`, { method: "DELETE" });
