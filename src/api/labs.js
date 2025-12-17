import { apiFetch } from "./client";

// GET all labs
export const getLabs = async () => {
  try {
    const res = await fetch("http://localhost:8001/labs/"); // fetch labs
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Failed to fetch labs:", err);
    return [];
  }
};

// POST to create Lab (identity)
export const createLabIdentity = async (labData) => {
  try {
    const res = await fetch("http://localhost:8001/labs/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: labData.lab_name,
        domain: labData.domain,
        description: labData.description,
      }),
    });
    return await res.json(); // returns created Lab with id
  } catch (err) {
    console.error("Failed to create lab identity:", err);
    throw err;
  }
};
