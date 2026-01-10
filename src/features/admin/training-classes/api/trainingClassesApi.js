const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

/* =========================
   FETCH ALL TRAINING CLASSES
========================= */
export async function fetchTrainingClassesApi() {
  const res = await fetch(`${API_BASE}/training-classes`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch training classes");
  }

  return res.json();
}

/* =========================
   CREATE TRAINING CLASS
========================= */
export async function createTrainingClass(payload) {
  const res = await fetch(`${API_BASE}/training-classes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to create training class");
  }

  return true;
}

export async function updateTrainingSchedule(id, payload) {
  const res = await fetch(
    `${API_BASE}/training-classes/${id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to update schedule");
  }
}

/* =========================
   FETCH TRAINING CLASS BY ID ✅ (NEW)
========================= */
export async function fetchTrainingClassById(id) {
  const res = await fetch(`${API_BASE}/training-classes/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch training class");
  }

  return res.json();
}
