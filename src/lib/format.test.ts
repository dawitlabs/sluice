import { describe, expect, it } from "vitest";
import { formatClock, formatDay, formatDuration } from "./format";

describe("formatDuration", () => {
  it("keeps sub-second values in milliseconds", () => {
    expect(formatDuration(0)).toBe("0ms");
    expect(formatDuration(84)).toBe("84ms");
    expect(formatDuration(999)).toBe("999ms");
  });

  it("switches to seconds at one thousand milliseconds", () => {
    expect(formatDuration(1000)).toBe("1.00s");
    expect(formatDuration(1310)).toBe("1.31s");
    expect(formatDuration(2280)).toBe("2.28s");
  });
});

describe("formatClock", () => {
  it("renders UTC time with zero padding", () => {
    expect(formatClock(new Date("2026-11-19T09:04:03.000Z"))).toBe("09:04:03");
  });
});

describe("formatDay", () => {
  it("renders an ISO date", () => {
    expect(formatDay(new Date("2026-11-19T23:59:59.000Z"))).toBe("2026-11-19");
  });
});
