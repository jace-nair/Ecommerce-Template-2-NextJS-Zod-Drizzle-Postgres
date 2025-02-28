import {
	AnyPgColumn,
	integer,
	pgTable,
	serial,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

import { relations } from "drizzle-orm";

import { user, post } from "@/db/schema";

import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Schema Table
export const comment = pgTable("comment", {
	id: serial("id").primaryKey(),
	parentId: integer("parent_id").references((): AnyPgColumn => comment.id),

	userId: integer("user_id").references(() => user.id).notNull(),
	content: text("content").notNull(),
	postId: integer("post_id").references(() => post.id).notNull(),
	createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
	updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

// Schema Relations
export const commentRelations = relations(comment, ({ one }) => ({
	user: one(user, {
		fields: [comment.userId],
		references: [user.id],
	}),
	post: one(post, {
		fields: [comment.postId],
		references: [post.id],
	}),
}));

// Schema Type
export const commentSchema = createInsertSchema(comment, {
    postId: (schema) => schema.min(1),
    content: (schema) => schema.min(1),
    userId: (schema) => schema.min(1),
}).pick({
    postId: true,
    content: true,
    parentId: true,
    userId: true,
    id: true,
});


export type CommentSchemaType = z.infer<typeof commentSchema>;