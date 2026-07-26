import { pgTable, serial, text, integer, timestamp, boolean, pgEnum, jsonb } from "drizzle-orm/pg-core";

// Enums
export const phaseStatusEnum = pgEnum("phase_status", ["pending", "in_progress", "completed", "failed", "blocked"]);
export const taskStatusEnum = pgEnum("task_status", ["pending", "in_progress", "completed", "failed", "skipped"]);
export const agentStatusEnum = pgEnum("agent_status", ["offline", "initializing", "online", "error", "maintenance"]);
export const healthStatusEnum = pgEnum("health_status", ["unknown", "healthy", "degraded", "unhealthy"]);
export const severityEnum = pgEnum("severity", ["info", "warning", "error", "critical"]);

// Build Phases
export const phases = pgTable("phases", {
  id: serial("id").primaryKey(),
  phaseNumber: integer("phase_number").notNull().unique(),
  name: text("name").notNull(),
  target: text("target").notNull(),
  status: phaseStatusEnum("status").default("pending").notNull(),
  healthCheckPassed: boolean("health_check_passed").default(false).notNull(),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  errorCount: integer("error_count").default(0).notNull(),
  retryCount: integer("retry_count").default(0).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tasks within phases
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  phaseId: integer("phase_id").references(() => phases.id).notNull(),
  taskNumber: text("task_number").notNull(),
  description: text("description").notNull(),
  status: taskStatusEnum("status").default("pending").notNull(),
  output: text("output"),
  errorMessage: text("error_message"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Health Checks
export const healthChecks = pgTable("health_checks", {
  id: serial("id").primaryKey(),
  phaseId: integer("phase_id").references(() => phases.id).notNull(),
  checkName: text("check_name").notNull(),
  description: text("description").notNull(),
  status: healthStatusEnum("status").default("unknown").notNull(),
  lastChecked: timestamp("last_checked"),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Agents
export const agents = pgTable("agents", {
  id: serial("id").primaryKey(),
  agentNumber: integer("agent_number").notNull().unique(),
  name: text("name").notNull(),
  codeName: text("code_name").notNull(),
  role: text("role").notNull(),
  model: text("model").notNull(),
  status: agentStatusEnum("status").default("offline").notNull(),
  mattermostBot: text("mattermost_bot"),
  tools: jsonb("tools").$type<string[]>().default([]),
  hardRules: jsonb("hard_rules").$type<string[]>().default([]),
  memoryNamespace: text("memory_namespace"),
  lastActive: timestamp("last_active"),
  taskCount: integer("task_count").default(0).notNull(),
  errorCount: integer("error_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Workflows
export const workflows = pgTable("workflows", {
  id: serial("id").primaryKey(),
  workflowNumber: integer("workflow_number").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  trigger: text("trigger").notNull(),
  status: taskStatusEnum("status").default("pending").notNull(),
  isActive: boolean("is_active").default(false).notNull(),
  lastRun: timestamp("last_run"),
  nextRun: timestamp("next_run"),
  runCount: integer("run_count").default(0).notNull(),
  errorCount: integer("error_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Services
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  port: integer("port").notNull(),
  category: text("category").notNull(),
  status: healthStatusEnum("status").default("unknown").notNull(),
  url: text("url"),
  description: text("description"),
  lastChecked: timestamp("last_checked"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Build Logs
export const buildLogs = pgTable("build_logs", {
  id: serial("id").primaryKey(),
  phaseId: integer("phase_id").references(() => phases.id),
  taskId: integer("task_id").references(() => tasks.id),
  severity: severityEnum("severity").default("info").notNull(),
  message: text("message").notNull(),
  details: text("details"),
  source: text("source"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Mattermost Channels
export const channels = pgTable("channels", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  category: text("category"),
  isCreated: boolean("is_created").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Types
export type Phase = typeof phases.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type HealthCheck = typeof healthChecks.$inferSelect;
export type Agent = typeof agents.$inferSelect;
export type Workflow = typeof workflows.$inferSelect;
export type Service = typeof services.$inferSelect;
export type BuildLog = typeof buildLogs.$inferSelect;
export type Channel = typeof channels.$inferSelect;
