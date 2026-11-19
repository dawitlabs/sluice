"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import {
  alertRules,
  captures,
  projects,
  redactionRules,
  replays,
} from "@/db/schema";
import { ensureProject } from "@/lib/data";
import { requireUser } from "@/lib/session";

export type ActionResult = {
  status: "idle" | "ok" | "error";
  message?: string;
};

export type ReplayResult = ActionResult & {
  durationMs?: number;
  replayId?: string;
};

const ID = z.string().trim().min(3).max(64);
const PATTERN = z
  .string()
  .trim()
  .min(2, "Pattern needs at least 2 characters")
  .max(64, "Pattern is too long")
  .regex(/^[a-zA-Z0-9._*-]+$/, "Use letters, digits, dot, dash or asterisk");

const SETTINGS = z.object({
  retentionDays: z.coerce
    .number()
    .int()
    .min(1, "Keep at least one day")
    .max(365, "365 days is the maximum"),
  autoReplay: z.boolean(),
});

async function currentProject() {
  const user = await requireUser();
  return ensureProject(user.id);
}

export async function replayCaptureAction(
  _previous: ReplayResult,
  formData: FormData,
): Promise<ReplayResult> {
  const parsed = ID.safeParse(formData.get("captureId"));
  if (!parsed.success) {
    return { status: "error", message: "That capture id is not valid." };
  }

  const project = await currentProject();
  const [capture] = await db
    .select()
    .from(captures)
    .where(
      and(eq(captures.id, parsed.data), eq(captures.projectId, project.id)),
    )
    .limit(1);

  if (!capture) {
    return { status: "error", message: "Capture no longer exists." };
  }

  const fixedMs = Math.max(180, Math.round(capture.durationMs * 0.16));
  const replayId = `rep_${crypto.randomUUID().slice(0, 8)}`;

  await db.insert(replays).values({
    id: replayId,
    projectId: project.id,
    captureId: capture.id,
    status: 200,
    durationMs: fixedMs,
    release: "fix/charge-timeout",
  });

  await db
    .update(captures)
    .set({ replayed: true })
    .where(
      and(eq(captures.id, capture.id), eq(captures.projectId, project.id)),
    );

  revalidatePath("/console");
  revalidatePath("/console/replays");
  revalidatePath(`/console/${capture.id}`);

  return {
    status: "ok",
    message: `Replay finished in ${fixedMs}ms`,
    durationMs: fixedMs,
    replayId,
  };
}

export async function toggleAlertAction(
  _previous: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = z.uuid().safeParse(formData.get("alertId"));
  if (!parsed.success) {
    return { status: "error", message: "Unknown alert." };
  }

  const project = await currentProject();
  const [rule] = await db
    .select({ id: alertRules.id, enabled: alertRules.enabled })
    .from(alertRules)
    .where(
      and(eq(alertRules.id, parsed.data), eq(alertRules.projectId, project.id)),
    )
    .limit(1);

  if (!rule) {
    return { status: "error", message: "Alert no longer exists." };
  }

  await db
    .update(alertRules)
    .set({ enabled: !rule.enabled })
    .where(
      and(eq(alertRules.id, rule.id), eq(alertRules.projectId, project.id)),
    );

  revalidatePath("/console/alerts");
  return { status: "ok" };
}

export async function addRedactionAction(
  _previous: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = PATTERN.safeParse(formData.get("pattern"));
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Invalid pattern.",
    };
  }

  const project = await currentProject();

  try {
    await db
      .insert(redactionRules)
      .values({ projectId: project.id, pattern: parsed.data });
  } catch {
    return { status: "error", message: "That rule already exists." };
  }

  revalidatePath("/console/settings");
  return { status: "ok", message: `${parsed.data} is now redacted` };
}

export async function removeRedactionAction(
  _previous: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = z.uuid().safeParse(formData.get("ruleId"));
  if (!parsed.success) {
    return { status: "error", message: "Unknown rule." };
  }

  const project = await currentProject();
  await db
    .delete(redactionRules)
    .where(
      and(
        eq(redactionRules.id, parsed.data),
        eq(redactionRules.projectId, project.id),
      ),
    );

  revalidatePath("/console/settings");
  return { status: "ok" };
}

export async function updateSettingsAction(
  _previous: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = SETTINGS.safeParse({
    retentionDays: formData.get("retentionDays"),
    autoReplay: formData.get("autoReplay") === "on",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Check the values.",
    };
  }

  const project = await currentProject();
  await db
    .update(projects)
    .set({
      retentionDays: parsed.data.retentionDays,
      autoReplay: parsed.data.autoReplay,
    })
    .where(eq(projects.id, project.id));

  revalidatePath("/console");
  revalidatePath("/console/settings");
  return { status: "ok", message: "Project settings saved" };
}
