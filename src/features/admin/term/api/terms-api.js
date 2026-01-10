const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

/* =========================
   FETCH ALL TERMS
========================= */
export async function fetchTermsApi() {
  const res = await fetch(`${API_BASE_URL}/terms`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to fetch terms");
  return res.json();
}

/* =========================
   CREATE TERM
========================= */
export async function createTermApi(payload) {
  const res = await fetch(`${API_BASE_URL}/terms`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to create term");
  return res.json();
}

/* =========================
   UPDATE TERM
========================= */
export async function updateTermApi(id, payload) {
  const res = await fetch(`${API_BASE_URL}/terms/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to update term");
  return res.json();
}

/* =========================
   GET TERM BY ID
========================= */
export async function fetchTermByIdApi(id) {
  const res = await fetch(`${API_BASE_URL}/terms/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to fetch term");
  return res.json();
}

/* =========================
   DELETE TERM
========================= */
export async function deleteTermApi(id) {
  const res = await fetch(`${API_BASE_URL}/terms/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete term");
  return res.text();
}
