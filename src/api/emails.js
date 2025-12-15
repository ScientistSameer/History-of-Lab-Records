import { apiFetch } from "./client";

export const getEmails = () => apiFetch("/emails");
