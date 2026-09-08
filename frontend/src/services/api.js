const API_BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/contacts`;

async function handleResponse(res) {
  let data = null;
  try {
    data = await res.json();
  } catch {
    // response had no JSON body, that's fine for some cases
  }

  if (!res.ok) {
    const error = new Error(data?.message || 'Something went wrong');
    error.status = res.status;
    error.fieldErrors = data?.errors || null;
    throw error;
  }

  return data;
}

export function fetchContacts(search = '') {
  const url = search ? `${API_BASE}?search=${encodeURIComponent(search)}` : API_BASE;
  return fetch(url).then(handleResponse);
}

export function createContact(payload) {
  return fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(handleResponse);
}

export function updateContact(id, payload) {
  return fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(handleResponse);
}

export function deleteContact(id) {
  return fetch(`${API_BASE}/${id}`, { method: 'DELETE' }).then(handleResponse);
}
