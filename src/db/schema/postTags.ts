import { integer, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { post, tag } from "@/db/schema"

import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Schema Table
export const postTags = pgTable(
	"post_to_tag",
	{
		postId: integer("post_id")
			.notNull()
			.references(() => post.id),
		tagId: integer("tag_id")
			.notNull()
			.references(() => tag.id),
	},
	(table) => [
		primaryKey({ name: "pk", columns: [table.postId, table.tagId] }),
	]
);

// Schema Relations
export const postTagsRelations = relations(postTags, ({ one }) => ({
	tag: one(tag, { fields: [postTags.tagId], references: [tag.id] }),
	post: one(post, { fields: [postTags.postId], references: [post.id] }),
}));

// Schema Type
export const postTagsSchema = createInsertSchema(postTags);
export type PostTagsSchemaType = z.infer<typeof postTagsSchema>;