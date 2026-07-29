export function isWeekend(date: Date = new Date()): boolean {
  const day = date.getDay()
  return day === 0 || day === 6
}
