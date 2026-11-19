import { describe, expect, it } from "vitest";
import { safeNext } from "./redirect";

describe("safeNext", () => {
  it("allows same-origin paths", () => {
    expect(safeNext("/console")).toBe("/console");
    expect(safeNext("/console/req_9f4c1a")).toBe("/console/req_9f4c1a");
  });

  it("falls back when the value is missing", () => {
    expect(safeNext(undefined)).toBe("/console");
    expect(safeNext("")).toBe("/console");
  });

  it("blocks absolute and protocol-relative targets", () => {
    expect(safeNext("https://evil.example")).toBe("/console");
    expect(safeNext("//evil.example")).toBe("/console");
    expect(safeNext("javascript:alert(1)")).toBe("/console");
  });

  it("unwraps array search params", () => {
    expect(safeNext(["/console/replays", "/other"])).toBe("/console/replays");
  });
});
