const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export async function fetchServiceRequestsApi() {
  const res = await fetch(
    `${API_BASE_URL}/service-request/get-service-tickets/`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch service requests");
  }

  const data = await res.json();
  if (!Array.isArray(data)) {
    throw new Error("Invalid data format");
  }
  return data;
}

export async function approveServiceRequestApi(id) {
  const res = await fetch(
    `${API_BASE_URL}/service-request/approve-service-register-ticket/${id}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to approve request");
  }

  return res.text().catch(() => "Approved successfully");
}

export async function rejectServiceRequestApi(id) {
  const res = await fetch(
    `${API_BASE_URL}/service-request/reject-service-register-ticket/${id}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to reject request");
  }

  return res.text().catch(() => "Rejected successfully");
}
