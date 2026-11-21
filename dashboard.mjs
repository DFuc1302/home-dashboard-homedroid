export function greetingForHour(hour) {
  if (hour < 11) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function weatherLabel(code) {
  if (code === 0) return "Clear sky";
  if ([1, 2].includes(code)) return "Partly cloudy";
  if (code === 3) return "Overcast";
  if ([45, 48].includes(code)) return "Foggy";
  if (code >= 51 && code <= 67) return "Rain";
  if (code >= 71 && code <= 77) return "Snow";
  if (code >= 80 && code <= 82) return "Rain showers";
  if (code >= 95) return "Thunderstorms";
  return "Variable weather";
}

export function serviceUrl(host, port, path = "") {
  return `http://${host}:${port}${path}`;
}

export function formatWind(speed) {
  return `${Math.round(Number(speed) || 0)} km/h`;
}
