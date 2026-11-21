import assert from "node:assert/strict";
import { formatWind, greetingForHour, serviceUrl, weatherLabel } from "./dashboard.mjs";

assert.equal(greetingForHour(6), "Chào buổi sáng");
assert.equal(greetingForHour(14), "Chào buổi chiều");
assert.equal(greetingForHour(22), "Chào buổi tối");
assert.equal(weatherLabel(0), "Trời quang");
assert.equal(weatherLabel(61), "Có mưa");
assert.equal(serviceUrl("192.168.1.163", 8800), "http://192.168.1.163:8800");
assert.equal(formatWind(12.6), "13 km/h");

console.log("dashboard checks passed");
