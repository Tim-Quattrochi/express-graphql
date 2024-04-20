export function formatDate(timestamp: string): string {
  const date = new Date(Number(timestamp));
  return date.toLocaleString(); 
}