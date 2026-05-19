import dayjs from "dayjs";

export function formatTime(date: Date): string {
  return dayjs(date).format("HH:mm:ss");
}

export function formatDate(date: Date): string {
  const weekdays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  return `${dayjs(date).format("YYYY年MM月DD日")} ${weekdays[date.getDay()]}`;
}

export function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 6) return "凌晨好";
  if (h < 9) return "早上好";
  if (h < 12) return "上午好";
  if (h < 14) return "中午好";
  if (h < 18) return "下午好";
  if (h < 22) return "晚上好";
  return "夜深了";
}
