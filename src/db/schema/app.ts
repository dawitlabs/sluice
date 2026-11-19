import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ownerId: text("owner_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    region: text("region").notNull().default("iad1"),
    retentionDays: integer("retention_days").notNull().default(7),
    autoReplay: boolean("auto_replay").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("projects_owner_slug_uq").on(table.ownerId, table.slug),
  ],
);

export const captures = pgTable(
  "captures",
  {
    id: text("id").primaryKey(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    method: text("method").notNull(),
    path: text("path").notNull(),
    status: integer("status").notNull(),
    durationMs: integer("duration_ms").notNull(),
    at: timestamp("at", { withTimezone: true }).notNull().defaultNow(),
    region: text("region").notNull(),
    release: text("release").notNull(),
    replayed: boolean("replayed").notNull().default(false),
    requestBody: text("request_body").notNull(),
    responseBody: text("response_body").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("captures_project_at_idx").on(table.projectId, table.at.desc()),
    index("captures_project_status_idx").on(table.projectId, table.status),
  ],
);

export const spans = pgTable(
  "spans",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    captureId: text("capture_id")
      .notNull()
      .references(() => captures.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    service: text("service").notNull(),
    startMs: integer("start_ms").notNull(),
    durationMs: integer("duration_ms").notNull(),
    status: text("status").notNull(),
  },
  (table) => [index("spans_capture_idx").on(table.captureId, table.startMs)],
);

export const replays = pgTable(
  "replays",
  {
    id: text("id").primaryKey(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    captureId: text("capture_id")
      .notNull()
      .references(() => captures.id, { onDelete: "cascade" }),
    status: integer("status").notNull(),
    durationMs: integer("duration_ms").notNull(),
    release: text("release").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("replays_project_created_idx").on(
      table.projectId,
      table.createdAt.desc(),
    ),
  ],
);

export const alertRules = pgTable(
  "alert_rules",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    condition: text("condition").notNull(),
    channel: text("channel").notNull().default("slack"),
    enabled: boolean("enabled").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("alert_rules_project_idx").on(table.projectId)],
);

export const redactionRules = pgTable(
  "redaction_rules",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    pattern: text("pattern").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("redaction_project_pattern_uq").on(
      table.projectId,
      table.pattern,
    ),
  ],
);
