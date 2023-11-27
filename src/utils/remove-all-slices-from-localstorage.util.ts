export default function removeAllSlicesFromLocalStorage(params?: {
  excludes: string[];
}) {
  const localStorageKeys: string[] = Object.keys(localStorage);
  localStorageKeys.forEach((key) => {
    if (key.startsWith('slice') && !params?.excludes.includes(key)) {
      localStorage.removeItem(key);
    }
  });
}
