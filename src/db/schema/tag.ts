import { pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { postTags } from "@/db/schema";

import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Schema Table
export const tag = pgTable("tag", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 255 }).notNull().unique(),
});

// Schema Relations
export const tagRelations = relations(tag, ({ many }) => ({
	postToTag: many(postTags),
}));

// Schema Type
export const tagSchema = createInsertSchema(tag);
export type TagSchemaType = z.infer<typeof tagSchema>;