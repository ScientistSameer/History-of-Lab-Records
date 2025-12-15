import { apiFetch } from "./client";

export const getLabs = () => apiFetch("/labs");

export const addLab = (data) =>
  apiFetch("/labs", {
    method: "POST",
    body: JSON.stringify(data),
  });
