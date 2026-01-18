const STORAGE_KEY = "selection_admin_api_key";

export function getAdminApiKey() {
  try {
    return localStorage.getItem(STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

export function setAdminApiKey(value: string) {
  localStorage.setItem(STORAGE_KEY, value);
}

export function clearAdminApiKey() {
  localStorage.removeItem(STORAGE_KEY);
}

