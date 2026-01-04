const BASE = "http://localhost:8001/ideal-lab";

export const getIdealLab = async () => {
  const res = await fetch(BASE);
  return await res.json();
};

export const updateIdealLab = async (data) => {
  const res = await fetch(BASE, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return await res.json();
};
