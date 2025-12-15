import { apiFetch } from "./client";

export const getResearchers = () => apiFetch("/researchers");
