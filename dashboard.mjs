export function greetingForHour(hour) {
  if (hour < 11) return "Chào buổi sáng";
  if (hour < 18) return "Chào buổi chiều";
  return "Chào buổi tối";
}

export function weatherLabel(code) {
  if (code === 0) return "Trời quang";
  if ([1, 2].includes(code)) return "Ít mây";
  if (code === 3) return "Nhiều mây";
  if ([45, 48].includes(code)) return "Có sương mù";
  if (code >= 51 && code <= 67) return "Có mưa";
  if (code >= 71 && code <= 77) return "Có tuyết";
  if (code >= 80 && code <= 82) return "Mưa rào";
  if (code >= 95) return "Có giông";
  return "Thời tiết thay đổi";
}

export function serviceUrl(host, port, path = "") {
  return `http://${host}:${port}${path}`;
}

export function formatWind(speed) {
  return `${Math.round(Number(speed) || 0)} km/h`;
}
