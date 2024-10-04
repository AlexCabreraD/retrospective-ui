export const SOCKET_SERVER_URL: string = "http://localhost:8080";

export function randomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const profileIconColors: string[] = [
  "#FF5733", // Red-Orange
  "#C70039", // Crimson
  "#FFC300", // Gold
  "#FF5733", // Tomato
  "#DAF7A6", // Light Green
  "#581845", // Purple
  "#900C3F", // Dark Pink
  "#FF6F61", // Coral
  "#4B0082", // Indigo
  "#FF8C00", // Dark Orange
  "#28B463", // Green
  "#3498DB", // Sky Blue
  "#8E44AD", // Amethyst
  "#F39C12", // Orange
  "#E67E22", // Carrot
  "#1F618D", // Dark Blue
  "#F1C40F", // Bright Yellow
  "#D35400", // Pumpkin
  "#2ECC71", // Emerald
  "#A569BD", // Lavender
];
