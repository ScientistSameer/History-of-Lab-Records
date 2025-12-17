// api/researchers.js
import { apiFetch } from "./client";

export const getResearchers = () => apiFetch("/researchers");
export const getResearchersSummary = () => apiFetch("/researchers/summary");
export const createResearcher = (researcherData) =>
  apiFetch("/researchers", { method: "POST", body: JSON.stringify(researcherData) });
