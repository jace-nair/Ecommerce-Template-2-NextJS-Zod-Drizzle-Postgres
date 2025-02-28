import { pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { post } from "@/db/schema";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Schema Table
export const category = pgTable("category", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 255 }).notNull().unique(),
});

// Schema Relations
export const categoryRelations = relations(category, ({ many }) => ({
	posts: many(post),
}));

// Schema Type
export const categorySchema = createInsertSchema(category);
export type CategorySchemaType = z.infer<typeof categorySchema>;