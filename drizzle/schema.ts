import { pgTable, index, pgEnum, varchar, timestamp, numeric, text, boolean, unique, integer, serial } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const UserRole = pgEnum("UserRole", ['user', 'admin'])


export const digital_password_reset_tokens = pgTable("digital_password_reset_tokens", {
	id: varchar("id", { length: 40 }).primaryKey().notNull(),
	user_id: varchar("user_id", { length: 21 }).notNull(),
	expires_at: timestamp("expires_at", { withTimezone: true, mode: 'string' }).notNull(),
},
(table) => {
	return {
		password_token_user_idx: index("password_token_user_idx").on(table.user_id),
	}
});

export const digital_products = pgTable("digital_products", {
	id: varchar("id").default(gen_random_uuid()).primaryKey().notNull(),
	name: varchar("name", { length: 255 }).notNull(),
	price: numeric("price").notNull(),
	file_path: text("file_path").notNull(),
	image_path: text("image_path").notNull(),
	description: text("description").notNull(),
	is_available_for_purchase: boolean("is_available_for_purchase").default(true).notNull(),
	created_at: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp("updated_at", { withTimezone: true, mode: 'string' }).notNull(),
});

export const digital_sessions = pgTable("digital_sessions", {
	id: varchar("id", { length: 255 }).primaryKey().notNull(),
	user_id: varchar("user_id", { length: 21 }).notNull(),
	expires_at: timestamp("expires_at", { withTimezone: true, mode: 'string' }).notNull(),
},
(table) => {
	return {
		session_user_idx: index("session_user_idx").on(table.user_id),
	}
});

export const digital_orders = pgTable("digital_orders", {
	id: varchar("id").default(gen_random_uuid()).primaryKey().notNull(),
	user_id: varchar("user_id").notNull(),
	product_id: varchar("product_id").notNull(),
	discount_code_id: varchar("discount_code_id"),
	total_amount: numeric("total_amount", { precision: 10, scale:  2 }).notNull(),
	status: varchar("status").notNull(),
	is_paid: boolean("is_paid").default(false).notNull(),
	created_at: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const digital_users = pgTable("digital_users", {
	id: varchar("id", { length: 21 }).primaryKey().notNull(),
	discord_id: varchar("discord_id", { length: 255 }),
	github_id: varchar("github_id", { length: 255 }),
	google_id: varchar("google_id", { length: 255 }),
	email: varchar("email", { length: 255 }).notNull(),
	email_verified: boolean("email_verified").default(false).notNull(),
	hashed_password: varchar("hashed_password", { length: 255 }),
	avatar: varchar("avatar", { length: 255 }),
	created_at: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp("updated_at", { mode: 'string' }),
},
(table) => {
	return {
		user_email_idx: index("user_email_idx").on(table.email),
		user_github_idx: index("user_github_idx").on(table.github_id),
		user_google_idx: index("user_google_idx").on(table.google_id),
		user_discord_idx: index("user_discord_idx").on(table.discord_id),
		digital_users_discord_id_unique: unique("digital_users_discord_id_unique").on(table.discord_id),
		digital_users_github_id_unique: unique("digital_users_github_id_unique").on(table.github_id),
		digital_users_google_id_unique: unique("digital_users_google_id_unique").on(table.google_id),
		digital_users_email_unique: unique("digital_users_email_unique").on(table.email),
	}
});

export const digital_discount_codes = pgTable("digital_discount_codes", {
	id: varchar("id").default(gen_random_uuid()).primaryKey().notNull(),
	code: varchar("code", { length: 255 }).notNull(),
	discount_amount: integer("discount_amount").notNull(),
	discount_type: varchar("discount_type").notNull(),
	uses: integer("uses").default(0).notNull(),
	is_active: boolean("is_active").default(true).notNull(),
	all_products: boolean("all_products").default(false).notNull(),
	limit: integer("limit"),
	expires_at: timestamp("expires_at", { mode: 'string' }),
	created_at: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		digital_discount_codes_code_unique: unique("digital_discount_codes_code_unique").on(table.code),
	}
});

export const digital_download_verifications = pgTable("digital_download_verifications", {
	id: varchar("id").default(gen_random_uuid()).primaryKey().notNull(),
	expires_at: timestamp("expires_at", { mode: 'string' }).notNull(),
	created_at: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	product_id: varchar("product_id").notNull(),
});

export const digital_email_verification_codes = pgTable("digital_email_verification_codes", {
	id: serial("id").primaryKey().notNull(),
	user_id: varchar("user_id", { length: 21 }).notNull(),
	email: varchar("email", { length: 255 }).notNull(),
	code: varchar("code", { length: 8 }).notNull(),
	expires_at: timestamp("expires_at", { withTimezone: true, mode: 'string' }).notNull(),
},
(table) => {
	return {
		verification_code_user_idx: index("verification_code_user_idx").on(table.user_id),
		verification_code_email_idx: index("verification_code_email_idx").on(table.email),
		digital_email_verification_codes_user_id_unique: unique("digital_email_verification_codes_user_id_unique").on(table.user_id),
	}
});

export const digital_order_items = pgTable("digital_order_items", {
	id: varchar("id").default(gen_random_uuid()).primaryKey().notNull(),
	order_id: varchar("order_id").notNull(),
	product_id: varchar("product_id").notNull(),
	quantity: integer("quantity").notNull(),
	price: numeric("price", { precision: 10, scale:  2 }).notNull(),
	created_at: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});