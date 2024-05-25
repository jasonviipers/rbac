import { relations } from "drizzle-orm";
import {
    pgTableCreator,
    serial,
    boolean,
    index,
    text,
    timestamp,
    varchar,
} from "drizzle-orm/pg-core";

export const pgTable = pgTableCreator((name) => `digital_${name}`);

export const users = pgTable("users", {
    id: varchar("id", { length: 21 }).primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    discordId: varchar("discord_id", { length: 255 }).unique(),
    githubId: varchar("github_id", { length: 255 }).unique(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    hashedPassword: varchar("hashed_password", { length: 255 }),
    avatar: varchar("avatar", { length: 255 }),
    currentTeamId: varchar("current_team_id", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).$onUpdate(() => new Date()),
}, (t) => ({
    emailIdx: index("user_email_idx").on(t.email),
    githubIdx: index("user_github_idx").on(t.githubId),
    discordIdx: index("user_discord_idx").on(t.discordId),
    currentTeamIdx: index("user_current_team_idx").on(t.currentTeamId),
}));

export const usersRelations = relations(users, ({ many }) => ({
    sessions: many(sessions),
    emailVerificationCodes: many(emailVerificationCodes),
    passwordResetTokens: many(passwordResetTokens),
    teamUsers: many(teamUsers),
    teams: many(teams),
}));

export const sessions = pgTable("sessions", {
    id: varchar("id", { length: 255 }).primaryKey(),
    userId: varchar("user_id", { length: 21 }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
}, (t) => ({
    userIdx: index("session_user_idx").on(t.userId),
}));

export const emailVerificationCodes = pgTable("email_verification_codes", {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 21 }).unique().notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    code: varchar("code", { length: 8 }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
}, (t) => ({
    userIdx: index("verification_code_user_idx").on(t.userId),
    emailIdx: index("verification_code_email_idx").on(t.email),
}));

export const passwordResetTokens = pgTable("password_reset_tokens", {
    id: varchar("id", { length: 40 }).primaryKey(),
    userId: varchar("user_id", { length: 21 }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
}, (t) => ({
    userIdx: index("password_token_user_idx").on(t.userId),
}));

export const role = pgTable("role", {
    id: varchar("id", { length: 21 }).primaryKey(),
    name: varchar("name", { length: 255 }).unique().notNull(),
    descriptions: text("descriptions"),
    teamId: varchar("team_id", { length: 21 }).notNull().references(() => teams.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).$onUpdate(() => new Date()),
});

export const roleRelations = relations(role, ({ many, one }) => ({
    team: one(teams, { fields: [role.teamId], references: [teams.id] }),
    rolePermissions: many(rolePermissions),
    teamUsers: many(teamUsers),
}));

export const permission = pgTable("permission", {
    id: varchar("id", { length: 21 }).primaryKey(),
    name: varchar("name", { length: 255 }).unique(),
    description: text("description"),
    teamId: varchar("team_id", { length: 21 }).notNull().references(() => teams.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).$onUpdate(() => new Date()),
});

export const permissionRelations = relations(permission, ({ many, one }) => ({
    team: one(teams, { fields: [permission.teamId], references: [teams.id] }),
    rolePermissions: many(rolePermissions),
}));

export const rolePermissions = pgTable('role_permissions', {
    id: serial('id').primaryKey(),
    roleId: varchar('role_id', { length: 21 }).notNull().references(() => role.id),
    permissionId: varchar('permission_id', { length: 21 }).notNull().references(() => permission.id),
    teamId: varchar('team_id', { length: 21 }).notNull().references(() => teams.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).$onUpdate(() => new Date()),
});

export const rolePermissionsRelations = relations(rolePermissions, ({ one, many }) => ({
    role: one(role, { fields: [rolePermissions.roleId], references: [role.id] }),
    permission: one(permission, { fields: [rolePermissions.permissionId], references: [permission.id] }),
    team: one(teams, { fields: [rolePermissions.teamId], references: [teams.id] }),
}));

export const teams = pgTable("teams", {
    id: varchar("id", { length: 21 }).primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    ownerId: varchar("owner_id", { length: 21 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).$onUpdate(() => new Date()),
}, (t) => ({
    ownerIdIdx: index("team_owner_idx").on(t.ownerId),
}));

export const teamsRelations = relations(teams, ({ one, many }) => ({
    owner: one(users, { fields: [teams.ownerId], references: [users.id] }),
    teamUsers: many(teamUsers),
    roles: many(role),
    permissions: many(permission),
    rolePermissions: many(rolePermissions),
}));

export const teamUsers = pgTable('team_users', {
    id: serial('id').primaryKey(),
    teamId: varchar('team_id', { length: 21 }).notNull().references((() => teams.id)),
    userId: varchar('user_id', { length: 21 }).notNull().references((() => users.id)),
    roleId: varchar('role_id', { length: 21 }).notNull().references((() => role.id)),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).$onUpdate(() => new Date()),
}, (t) => ({
    teamIdIdx: index('team_user_team_idx').on(t.teamId),
    userIdIdx: index('team_user_user_idx').on(t.userId),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Role = typeof role.$inferSelect;
export type Permission = typeof permission.$inferSelect;
export type Team = typeof teams.$inferSelect;
export type TeamUser = typeof teamUsers.$inferSelect;
export type RolePermission = typeof rolePermissions.$inferSelect;