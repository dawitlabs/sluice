export function safeNext(value: string | string[] | undefined): string {
  const candidate = Array.isArray(value) ? value[0] : value;
  if (candidate?.startsWith("/") && !candidate.startsWith("//")) {
    return candidate;
  }
  return "/console";
}
