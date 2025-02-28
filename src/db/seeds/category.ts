import { DB } from "@/db";
import { category } from "@/db/schema";
import { CategorySchemaType } from "@/db/schema/category";

const mock: CategorySchemaType[] = [
	{
		name: "Node.js",
	},
	{
		name: "React",
	},
	{
		name: "Python",
	},
	{
		name: "Javascript",
	},
	{
		name: "Algorithms",
	},
	{
		name: "Devops",
	},
	{
		name: "APIs",
	},
];

export async function seed(db: DB) {
	await db.insert(category).values(mock);
}
