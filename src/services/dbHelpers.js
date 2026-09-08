export function withTimeout(promise, ms = 3000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Firestore Timeout')), ms))
  ]);
}

export function getLocal(key, defaultData) {
  if (typeof window === 'undefined') return defaultData;
  try {
    const item = localStorage.getItem(`scholarcms_${key}`);
    return item ? JSON.parse(item) : defaultData;
  } catch (e) {
    return defaultData;
  }
}

export function setLocal(key, data) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`scholarcms_${key}`, JSON.stringify(data));
  } catch (e) {}
}
