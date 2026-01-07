const BASE_URL = import.meta.env.VITE_API_URL || "/api";

async function handleApiResponse(res) {
  // Accept only 2xx responses as success
  if (!res.ok) {
    // Try to parse error message, fallback to status text
    let errorDetail = '';
    try {
      const errJson = await res.json();
      errorDetail = errJson.error || errJson.message || res.statusText;
    } catch {
      errorDetail = res.statusText;
    }
    throw new Error(`Error ${res.status}: ${errorDetail}`);
  }
  return res.json();
}

export async function getProperties() {
  return handleApiResponse(await fetch(`${BASE_URL}/properties`));
}
export async function getProperty(id) {
  return handleApiResponse(await fetch(`${BASE_URL}/property/${id}`));
}
export async function deployAgreement(data) {
  return handleApiResponse(await fetch(`${BASE_URL}/deploy`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }));
}
export async function addProperty(data) {
  return handleApiResponse(await fetch(`${BASE_URL}/property`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }));
}
export async function getAgreement(address) {
  return handleApiResponse(await fetch(`${BASE_URL}/agreement/${address}`));
}
export async function activateAgreement(data) {
  return handleApiResponse(await fetch(`${BASE_URL}/activate`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }));
}
export async function terminateAgreement(data) {
  return handleApiResponse(await fetch(`${BASE_URL}/terminate`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }));
}
export async function getPropertiesByOwner(owner) {
  return handleApiResponse(await fetch(`${BASE_URL}/properties/by-owner/${owner}`));
}
