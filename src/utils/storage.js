/**
 * Apple-grade Persistent Storage Utility for JD Extractor
 * Primary: chrome.storage.local (high-capacity, extension-safe)
 * Fallback: localStorage (development, sandbox & synchronous cache)
 */

const RESUME_STORAGE_KEY = 'jd_candidate_resume_profile';
const SETTINGS_STORAGE_KEY = 'jd_user_settings';

/**
 * Safely check if chrome.storage.local is accessible
 */
function hasChromeStorage() {
  try {
    return Boolean(
      typeof chrome !== 'undefined' &&
      chrome?.storage?.local &&
      typeof chrome.storage.local.get === 'function'
    );
  } catch {
    return false;
  }
}

/**
 * Save resume profile to persistent storage
 * @param {Object} profile 
 * @returns {Promise<boolean>}
 */
export async function saveResumeProfile(profile) {
  if (!profile) return false;

  // 1. Sync to localStorage for immediate synchronous reads & offline safety
  try {
    localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.warn('[Storage] localStorage write fallback warning:', err);
  }

  // 2. Persist to chrome.storage.local
  if (hasChromeStorage()) {
    try {
      await chrome.storage.local.set({ [RESUME_STORAGE_KEY]: profile });
      return true;
    } catch (err) {
      console.warn('[Storage] chrome.storage.local write failed:', err);
    }
  }

  return true;
}

/**
 * Retrieve saved resume profile
 * @returns {Promise<Object|null>}
 */
export async function getResumeProfile() {
  // 1. Try chrome.storage.local first
  if (hasChromeStorage()) {
    try {
      const result = await chrome.storage.local.get(RESUME_STORAGE_KEY);
      if (result && result[RESUME_STORAGE_KEY]) {
        return result[RESUME_STORAGE_KEY];
      }
    } catch (err) {
      console.warn('[Storage] chrome.storage.local read error:', err);
    }
  }

  // 2. Fallback to localStorage
  try {
    const raw = localStorage.getItem(RESUME_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('[Storage] localStorage read error:', err);
  }

  return null;
}

/**
 * Remove saved resume profile from persistent storage
 * @returns {Promise<boolean>}
 */
export async function deleteResumeProfile() {
  try {
    localStorage.removeItem(RESUME_STORAGE_KEY);
  } catch (_) {}

  if (hasChromeStorage()) {
    try {
      await chrome.storage.local.remove(RESUME_STORAGE_KEY);
      return true;
    } catch (err) {
      console.warn('[Storage] chrome.storage.local remove failed:', err);
    }
  }

  return true;
}
