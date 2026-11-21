import { formatWind, greetingForHour, serviceUrl, weatherLabel } from "./dashboard.mjs";

const STORAGE = {
  theme: "nha.theme",
  place: "nha.place",
  tasks: "nha.tasks",
  note: "nha.note",
};

const services = [
  { name: "HomeDroid", port: 8800, color: "#78a8ff" },
  { name: "AdGuard Home", port: 3000, color: "#77e8c5" },
  { name: "Mộc Focus", port: 4173, color: "#c5f36a" },
  { name: "Jellyfin", port: 8096, color: "#aa7cff" },
  { name: "Home Assistant", port: 8123, color: "#58c5f7" },
  { name: "Local AI", port: 8090, color: "#ff9d7c" },
];

const defaultPlace = { name: "Ho Chi Minh City", latitude: 10.7769, longitude: 106.7009 };
const localHost = ["localhost", "127.0.0.1"].includes(location.hostname);
const serverHost = localHost ? "192.168.1.163" : location.hostname;
const $ = (selector) => document.querySelector(selector);
const loadJson = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
};

let place = loadJson(STORAGE.place, defaultPlace);
let tasks = loadJson(STORAGE.tasks, []);

const elements = {
  clock: $("#clock"), date: $("#date-label"), greeting: $("#greeting"),
  city: $("#weather-title"), temperature: $("#temperature"), weatherLabel: $("#weather-label"),
  weatherDetail: $("#weather-detail"), weatherError: $("#weather-error"),
  serviceGrid: $("#service-grid"), serviceTemplate: $("#service-template"), onlineCount: $("#online-count"),
  shortcutList: $("#shortcut-list"), refresh: $("#refresh-button"), theme: $("#theme-button"),
  cityDialog: $("#city-dialog"), cityForm: $("#city-form"), cityInput: $("#city-input"), cityStatus: $("#city-status"),
  taskForm: $("#task-form"), taskInput: $("#task-input"), taskList: $("#task-list"), taskCount: $("#task-count"),
  note: $("#note"), serverAddress: $("#server-address"), copyAddress: $("#copy-address"),
};

function updateClock() {
  const now = new Date();
  elements.clock.textContent = new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }).format(now);
  elements.date.textContent = new Intl.DateTimeFormat("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(now);
  elements.greeting.textContent = greetingForHour(now.getHours());
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(STORAGE.theme, theme);
}

async function fetchWeather() {
  elements.city.textContent = place.name;
  elements.weatherError.hidden = true;
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.search = new URLSearchParams({
    latitude: place.latitude,
    longitude: place.longitude,
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m",
    timezone: "auto",
  });
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("weather request failed");
    const { current } = await response.json();
    elements.temperature.textContent = `${Math.round(current.temperature_2m)}°`;
    elements.weatherLabel.textContent = weatherLabel(current.weather_code);
    elements.weatherDetail.textContent = `Feels like ${Math.round(current.apparent_temperature)}° · Humidity ${current.relative_humidity_2m}% · Wind ${formatWind(current.wind_speed_10m)}`;
  } catch {
    elements.weatherError.hidden = false;
    elements.weatherLabel.textContent = "No data available";
    elements.weatherDetail.textContent = "Check your internet connection";
  }
}

function renderServices() {
  elements.serviceGrid.replaceChildren();
  elements.shortcutList.replaceChildren();
  for (const service of services) {
    const card = elements.serviceTemplate.content.firstElementChild.cloneNode(true);
    const url = serviceUrl(serverHost, service.port);
    card.href = url;
    card.style.setProperty("--service-color", service.color);
    card.querySelector(".service-name").textContent = service.name;
    card.querySelector(".service-port").textContent = `Port ${service.port}`;
    card.dataset.port = service.port;
    elements.serviceGrid.append(card);
  }
  for (const service of services.slice(0, 4)) {
    const link = document.createElement("a");
    link.className = "shortcut";
    link.href = serviceUrl(serverHost, service.port);
    link.target = "_blank";
    link.rel = "noreferrer";
    const name = document.createElement("strong");
    name.textContent = service.name;
    const address = document.createElement("span");
    address.textContent = `:${service.port}`;
    link.append(name, address);
    elements.shortcutList.append(link);
  }
}

async function probeService(card) {
  card.classList.remove("online", "offline");
  card.querySelector(".service-status span").textContent = "Checking";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2600);
  try {
    await fetch(card.href, { mode: "no-cors", cache: "no-store", signal: controller.signal });
    card.classList.add("online");
    card.querySelector(".service-status span").textContent = "Online";
    return true;
  } catch {
    card.classList.add("offline");
    card.querySelector(".service-status span").textContent = "Offline";
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

async function checkServices() {
  elements.refresh.classList.add("loading");
  const cards = [...elements.serviceGrid.children];
  const results = await Promise.all(cards.map(probeService));
  elements.onlineCount.textContent = String(results.filter(Boolean).length);
  elements.refresh.classList.remove("loading");
}

function saveTasks() {
  localStorage.setItem(STORAGE.tasks, JSON.stringify(tasks));
}

function renderTasks() {
  elements.taskList.replaceChildren();
  for (const task of tasks) {
    const item = document.createElement("li");
    item.className = `task-item${task.done ? " done" : ""}`;
    item.dataset.id = task.id;
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.setAttribute("aria-label", `Mark ${task.text} as complete`);
    const text = document.createElement("span");
    text.textContent = task.text;
    const remove = document.createElement("button");
    remove.className = "delete-task";
    remove.type = "button";
    remove.dataset.delete = "true";
    remove.textContent = "×";
    remove.setAttribute("aria-label", `Delete ${task.text}`);
    item.append(checkbox, text, remove);
    elements.taskList.append(item);
  }
  const open = tasks.filter((task) => !task.done).length;
  elements.taskCount.textContent = `${open} ${open === 1 ? "task" : "tasks"}`;
}

async function findCity(name) {
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.search = new URLSearchParams({ name, count: "1", language: "en", format: "json" });
  const response = await fetch(url);
  if (!response.ok) throw new Error("search failed");
  const result = (await response.json()).results?.[0];
  if (!result) throw new Error("not found");
  return { name: [result.name, result.admin1].filter(Boolean).join(", "), latitude: result.latitude, longitude: result.longitude };
}

elements.theme.addEventListener("click", () => setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark"));
elements.refresh.addEventListener("click", checkServices);
elements.copyAddress.addEventListener("click", async () => {
  await navigator.clipboard.writeText(serverHost);
  elements.copyAddress.textContent = "Copied";
  setTimeout(() => { elements.copyAddress.textContent = "Copy server IP"; }, 1400);
});
$("#change-city").addEventListener("click", () => {
  elements.cityInput.value = place.name.split(",")[0];
  elements.cityStatus.textContent = "";
  elements.cityDialog.showModal();
});
elements.cityForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  elements.cityStatus.textContent = "Searching…";
  try {
    place = await findCity(elements.cityInput.value.trim());
    localStorage.setItem(STORAGE.place, JSON.stringify(place));
    elements.cityDialog.close();
    await fetchWeather();
  } catch {
    elements.cityStatus.textContent = "City not found.";
  }
});
elements.taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = elements.taskInput.value.trim();
  if (!text) return;
  tasks.unshift({ id: crypto.randomUUID(), text, done: false });
  elements.taskInput.value = "";
  saveTasks();
  renderTasks();
});
elements.taskList.addEventListener("click", (event) => {
  const item = event.target.closest(".task-item");
  if (!item) return;
  const task = tasks.find((candidate) => candidate.id === item.dataset.id);
  if (!task) return;
  if (event.target.matches("[data-delete]")) tasks = tasks.filter((candidate) => candidate.id !== task.id);
  else if (event.target.matches("input")) task.done = event.target.checked;
  saveTasks();
  renderTasks();
});
elements.note.addEventListener("input", () => localStorage.setItem(STORAGE.note, elements.note.value));

setTheme(localStorage.getItem(STORAGE.theme) || (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"));
elements.note.value = localStorage.getItem(STORAGE.note) || "";
elements.serverAddress.textContent = `HomeDroid · ${serverHost}`;
updateClock();
setInterval(updateClock, 30_000);
renderServices();
renderTasks();
fetchWeather();
checkServices();
