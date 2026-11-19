import "server-only";
import { ensureProject } from "@/lib/data";

export async function onboardUser(userId: string): Promise<void> {
  await ensureProject(userId);
}
