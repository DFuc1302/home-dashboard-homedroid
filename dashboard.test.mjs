import assert from "node:assert/strict";
import { formatWind, greetingForHour, serviceUrl, weatherLabel } from "./dashboard.mjs";

assert.equal(greetingForHour(6), "Good morning");
assert.equal(greetingForHour(14), "Good afternoon");
assert.equal(greetingForHour(22), "Good evening");
assert.equal(weatherLabel(0), "Clear sky");
assert.equal(weatherLabel(61), "Rain");
assert.equal(serviceUrl("192.168.1.163", 8800), "http://192.168.1.163:8800");
assert.equal(formatWind(12.6), "13 km/h");

console.log("dashboard checks passed");
