export const SOCKET_SERVER_URL: string = "http://localhost:8080";

export function stringToColor(str: string): string {
  // Normalize the string to lowercase to ensure consistent color generation
  str = str.trim().toLowerCase();

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const r = (hash >> 16) & 0xff;
  const g = (hash >> 8) & 0xff;
  const b = hash & 0xff;

  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}
