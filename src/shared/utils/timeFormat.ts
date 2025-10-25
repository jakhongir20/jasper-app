import dayjs, { Dayjs } from "dayjs";

export function timeFormatIn(dateString: Date): string {
  const now = new Date();
  const past = new Date(dateString);

  const diffMs = now.getTime() - past.getTime();
  // Convert ms difference to minutes
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) {
    // Less than 1 minute
    return "Только что";
  }
  if (diffMinutes < 60) {
    // Within an hour
    return `${diffMinutes} минут назад`;
  }
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} час${getRussianHourSuffix(diffHours)} назад`;
  }
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} дн${getRussianDaySuffix(diffDays)} назад`;
}

// Helpers for Russian suffixes (необязательно, но приятнее для уха)
function getRussianHourSuffix(hours: number) {
  // Пример упрощённой логики склонения для слова "час"
  // 1 час, 2-4 часа, 5-20 часов, 21 час, 22 часа, и т.д.
  const hMod10 = hours % 10;
  const hMod100 = hours % 100;
  if (hMod100 >= 11 && hMod100 <= 14) return "ов"; // 11-14 часов
  if (hMod10 === 1) return ""; // 1 час, 21 час
  if (hMod10 >= 2 && hMod10 <= 4) return "а"; // 2-4 часа, 22-24 часа
  return "ов"; // всё остальное: 5-20, 25-30 и т.д.
}

function getRussianDaySuffix(days: number) {
  // 1 день, 2-4 дня, 5-20 дней, 21 день, 22 дня
  const dMod10 = days % 10;
  const dMod100 = days % 100;
  if (dMod100 >= 11 && dMod100 <= 14) return "ей";
  if (dMod10 === 1) return "ь";
  if (dMod10 >= 2 && dMod10 <= 4) return "я";
  return "ей";
}

export const formatDate = (
  date: Dayjs | Date | string,
  style = "DD.MM.YYYY",
): string => dayjs(date).format(style);

// this will return the date in seconds
export const getDateTime = (date?: Date | Dayjs | string) =>
  date ? new Date(date?.toString()).getTime() / 1000 : undefined;
