CREATE TABLE IF NOT EXISTS "digital_email_verification_codes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(21) NOT NULL,
	"email" varchar(255) NOT NULL,
	"code" varchar(8) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	CONSTRAINT "digital_email_verification_codes_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "digital_password_reset_tokens" (
	"id" varchar(40) PRIMARY KEY NOT NULL,
	"user_id" varchar(21) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "digital_permission" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"description" text,
	"team_id" varchar(21) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "digital_permission_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "digital_role" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"descriptions" text,
	"team_id" varchar(21) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "digital_role_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "digital_role_permissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"role_id" varchar(21) NOT NULL,
	"permission_id" varchar(21) NOT NULL,
	"team_id" varchar(21) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "digital_sessions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(21) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "digital_team_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"team_id" varchar(21) NOT NULL,
	"user_id" varchar(21) NOT NULL,
	"role_id" varchar(21) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "digital_teams" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"owner_id" varchar(21) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "digital_users" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"discord_id" varchar(255),
	"github_id" varchar(255),
	"email" varchar(255) NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"hashed_password" varchar(255),
	"avatar" varchar(255),
	"current_team_id" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "digital_users_discord_id_unique" UNIQUE("discord_id"),
	CONSTRAINT "digital_users_github_id_unique" UNIQUE("github_id"),
	CONSTRAINT "digital_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "digital_permission" ADD CONSTRAINT "digital_permission_team_id_digital_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."digital_teams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "digital_role" ADD CONSTRAINT "digital_role_team_id_digital_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."digital_teams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "digital_role_permissions" ADD CONSTRAINT "digital_role_permissions_role_id_digital_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."digital_role"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "digital_role_permissions" ADD CONSTRAINT "digital_role_permissions_permission_id_digital_permission_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."digital_permission"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "digital_role_permissions" ADD CONSTRAINT "digital_role_permissions_team_id_digital_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."digital_teams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "digital_team_users" ADD CONSTRAINT "digital_team_users_team_id_digital_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."digital_teams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "digital_team_users" ADD CONSTRAINT "digital_team_users_user_id_digital_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."digital_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "digital_team_users" ADD CONSTRAINT "digital_team_users_role_id_digital_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."digital_role"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "verification_code_user_idx" ON "digital_email_verification_codes" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "verification_code_email_idx" ON "digital_email_verification_codes" ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "password_token_user_idx" ON "digital_password_reset_tokens" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_user_idx" ON "digital_sessions" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "team_user_team_idx" ON "digital_team_users" ("team_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "team_user_user_idx" ON "digital_team_users" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "team_owner_idx" ON "digital_teams" ("owner_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_email_idx" ON "digital_users" ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_github_idx" ON "digital_users" ("github_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_discord_idx" ON "digital_users" ("discord_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_current_team_idx" ON "digital_users" ("current_team_id");