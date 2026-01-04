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
        name: labData.name,
        description: labData.description,
        domain: labData.domain,
        sub_domains: labData.sub_domains,
        lab_type: labData.lab_type,
        email: labData.email,  // required
        website: labData.website,
        country: labData.country,
        city: labData.city,
        institute: labData.institute,
        total_researchers: labData.total_researchers,
        active_projects: labData.active_projects,
        max_project_capacity: labData.max_project_capacity,
        workload_score: labData.workload_score,
        availability_status: labData.availability_status,
        senior_researchers: labData.senior_researchers,
        phd_students: labData.phd_students,
        interns: labData.interns,
        equipment_level: labData.equipment_level,
        computing_resources: labData.computing_resources,
        funding_level: labData.funding_level,
        collaboration_interests: labData.collaboration_interests, // required
        preferred_domains: labData.preferred_domains,
        data_source: labData.data_source || "manual",
      }),
    });
    if (!res.ok) throw new Error("Failed to create lab");
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};