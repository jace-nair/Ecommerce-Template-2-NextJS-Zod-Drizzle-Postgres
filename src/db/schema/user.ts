import { InferSelectModel, relations } from "drizzle-orm";
import {
	integer,
	pgTable,
	serial,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";

import { post } from "@/db/schema"

import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Schema Table
export const user = pgTable("user", {
	id: serial("id").notNull().primaryKey(),
	fullName: varchar("full_name", { length: 255 }).notNull(),
	age: integer("age").notNull(),
	password: varchar("password", { length: 255 }).notNull(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
	updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

// Schema Relations
export const userRelations = relations(user, ({ many }) => ({
	posts: many(post),
}));

// Schema Type
const userBaseSchema = createInsertSchema(user, {
	fullName: (schema) => schema.min(1),
	password: (schema) => schema.min(1),
	age: z.coerce.number().min(18).max(99),
	email: (schema) => schema.email(),
}).pick({ fullName: true, password: true, age: true, email: true });

export const userSchema = z.union([
	z.object({
		mode: z.literal("signUp"),
		email: userBaseSchema.shape.email,
		password: userBaseSchema.shape.password,
		fullName: userBaseSchema.shape.fullName,
		age: userBaseSchema.shape.age,
	}),
	z.object({
		mode: z.literal("signIn"),
		email: userBaseSchema.shape.email,
		password: userBaseSchema.shape.password,
	}),
	z.object({
		mode: z.literal("update"),
		fullName: userBaseSchema.shape.fullName,
		age: userBaseSchema.shape.age,
		id: z.number().min(1),
	}),
]);

export type UserSchemaType = z.infer<typeof userSchema>;
export type UserModelType = InferSelectModel<typeof user>;