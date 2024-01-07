export function removeAllSlicesFromStorage(): void {
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('slice-')) {
      localStorage.removeItem(key);
    }
  });
}
