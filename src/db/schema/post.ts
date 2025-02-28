import {
	integer,
	pgTable,
	serial,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";
import { InferSelectModel, relations } from "drizzle-orm";

import { user, category, postTags, comment } from "@/db/schema";

import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Schema Table
export const post = pgTable("post", {
	id: serial("id").primaryKey(),
	userId: integer("user_id")
		.notNull()
		.references(() => user.id),
	title: varchar("title", { length: 255 }).notNull(),
	shortDescription: text("short_description"),
	content: text("content").notNull(),
	categoryId: integer("category_id")
		.references(() => category.id)
		.notNull(),
	createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
	updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

// Schema Relations
export const postRelations = relations(post, ({ one, many }) => ({
	user: one(user, {
		fields: [post.userId],
		references: [user.id],
	}),
	tags: many(postTags),
	comments: many(comment),
	category: one(category, {
		fields: [post.categoryId],
		references: [category.id],
	}),
}));

// Schema Type
export const postBaseSchema = createInsertSchema(post, {
    title: (schema) => schema.min(1),
    shortDescription: (schema) => schema.min(1).max(255),
    userId: (schema) => schema.min(1),
    categoryId: (schema) => schema.min(1),
}).pick({
    title: true,
    content: true,
    shortDescription: true,
    userId: true,
    categoryId: true,
});

export const postSchema = z.union([
    z.object({
		mode: z.literal("create"),
		title: postBaseSchema.shape.title,
		shortDescription: postBaseSchema.shape.shortDescription,
		userId: postBaseSchema.shape.userId,
		categoryId: postBaseSchema.shape.categoryId,
		content: postBaseSchema.shape.content,
		tagIds: z.array(z.number()),
	}),
    z.object({
		mode: z.literal("edit"),
		id: z.number().min(1),
		title: postBaseSchema.shape.title,
		shortDescription: postBaseSchema.shape.shortDescription,
		userId: postBaseSchema.shape.userId,
		categoryId: postBaseSchema.shape.categoryId,
		content: postBaseSchema.shape.content,
		tagIds: z.array(z.number()),
	}),
]);


export type PostSchemaType = z.infer<typeof postSchema>;
export type PostModelType = InferSelectModel<typeof post>;