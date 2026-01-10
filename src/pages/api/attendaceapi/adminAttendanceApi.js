const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

/* ---------- TERMS ---------- */
export async function getTerms() {
  const res = await fetch(`${API_BASE}/admin/terms`);
  if (!res.ok) throw new Error("Failed to fetch terms");
  return res.json();
}

/* ---------- CLASSES BY TERM ---------- */
export async function fetchClassesByTerm(termId) {
  const res = await fetch(`${API_BASE}/admin/terms/${termId}/classes`);
  if (!res.ok) throw new Error("Failed to load classes");
  return res.json();
}

/* ---------- SESSIONS (DATE TABS) ---------- */
export async function fetchSessions(classId, startTime) {
  const res = await fetch(
    `${API_BASE}/admin/training-classes/${classId}/sessions?startTime=${startTime}`
  );
  if (!res.ok) throw new Error("Failed to load sessions");
  return res.json();
}

/* ---------- ATTENDANCE FOR ONE SESSION ---------- */
export async function fetchSessionAttendance(sessionId) {
  const res = await fetch(
    `${API_BASE}/admin/sessions/${sessionId}/attendance`
  );
  if (!res.ok) throw new Error("Failed to load attendance");
  return res.json();
}

/* ---------- ATTENDANCE FOR ONE SESSION ---------- */
export async function fetchBookings() {
  const res = await fetch(
    `${API_BASE}/training-class-bookings`
  );
  if (!res.ok) throw new Error("Failed to load bookings");
  return res.json();
}


/* ---------- SAVE ATTENDANCE ---------- */
export async function saveAttendance(payload) {
  await fetch(`${API_BASE}/admin/attendance`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
