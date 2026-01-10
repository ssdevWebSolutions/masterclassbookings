const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

// GET all classes
export async function fetchClassesApi() {
  const res = await fetch(`${API_BASE_URL}/classes`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to fetch classes");
  return res.json();
}

// CREATE class
export async function createClassApi(payload) {
  const res = await fetch(`${API_BASE_URL}/classes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to create class");
  return res.json();
}

// UPDATE class
export async function updateClassApi(id, payload) {
  const res = await fetch(`${API_BASE_URL}/classes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to update class");
  return res.json();
}

// DELETE class
export async function deleteClassApi(id) {
  const res = await fetch(`${API_BASE_URL}/classes/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete class");
  return res.text();
}
