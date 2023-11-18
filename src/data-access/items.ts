import "server-only";

import { db } from "@/db";
import { Item, items } from "@/db/schema";
import { unstable_noStore } from "next/cache";
import { eq } from "drizzle-orm";

export async function getItems(): Promise<Item[]> {
  unstable_noStore();
  return db.query.items.findMany({});
}

export async function createItem(name: string): Promise<void> {
  await db.insert(items).values({ name });
}

export async function deleteItem(itemId: number): Promise<void> {
  await db.delete(items).where(eq(items.id, itemId));
}
