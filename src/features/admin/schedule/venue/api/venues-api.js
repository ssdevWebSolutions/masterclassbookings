const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";


export async function fetchVenuesApi() {
  const res = await fetch(`${API_BASE_URL}/venue/getAllVenueDetaails`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to fetch venues");
  return res.json();
}

export async function createVenueApi(payload) {
  const res = await fetch(`${API_BASE_URL}/venue/addvenue`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to create venue");
  return res.json();
}


export async function updateVenueApi(id, payload) {
  console.log(id.id,"od");
  const res = await fetch(`${API_BASE_URL}/venue/update/${id.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to update venue");
  return res.json();
}


export async function deleteVenueApi(id) {
  const res = await fetch(`${API_BASE_URL}/venue/getById/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete venue");
  return res.text();
}
